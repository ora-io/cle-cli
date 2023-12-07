/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'
import prompts from 'prompts'
import {
  blue,
  green,
  lightBlue,
  red,
  reset,
  yellow,
} from 'kolorist'
import { generateConfigFileContent } from './template'
const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ['_'] })
const cwd = process.cwd()

const defaultTargetDir = 'zkgraph-project'

const FRAMEWORKS = [{
  name: 'hello',
  display: 'Hello',
  color: blue,
}, {
  name: 'event',
  display: 'Event',
  color: yellow,
}, {
  name: 'storage',
  display: 'Storage',
  color: green,
}, {
  name: 'multiaddr',
  display: 'Multiaddr',
  color: green,
}, {
  name: 'uniswapprice',
  display: 'Uniswapprice',
  color: lightBlue,
}]

const TEMPLATES = FRAMEWORKS.map(item => item.name)

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
}

export async function init(argTargetDir?: string, argTemplate?: string) {
  let targetDir = argTargetDir || defaultTargetDir
  const getProjectName = () =>
    targetDir === '.' ? path.basename(path.resolve()) : targetDir
  let result: prompts.Answers<
    'projectName' | 'overwrite' | 'packageName' | 'framework' | 'privateKey' | 'pinataJWT'
  >
  try {
    result = await prompts([
      {
        type: argTargetDir ? null : 'text',
        name: 'projectName',
        message: reset('Project name:'),
        initial: defaultTargetDir,
        onState: (state) => {
          targetDir = formatTargetDir(state.value) || defaultTargetDir
        },
      },
      {
        type: () =>
          !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
        name: 'overwrite',
        message: () =>
          `${targetDir === '.'
            ? 'Current directory'
            : `Target directory "${targetDir}"`
          } is not empty. Remove existing files and continue?`,
      },
      {
        type: (_, { overwrite }: { overwrite?: boolean }) => {
          if (overwrite === false)
            throw new Error(`${red('✖')} Operation cancelled`)

          return null
        },
        name: 'overwriteChecker',
      },
      {
        type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
        name: 'packageName',
        message: reset('Package name:'),
        initial: () => toValidPackageName(getProjectName()),
        validate: dir =>
          isValidPackageName(dir) || 'Invalid package.json name',
      },
      {
        type:
          argTemplate && TEMPLATES.includes(argTemplate) ? null : 'select',
        name: 'framework',
        message:
          typeof argTemplate === 'string' && !TEMPLATES.includes(argTemplate)
            ? reset(
                `"${argTemplate}" isn't a valid template. Please choose from below: `,
            )
            : reset('Select a template:'),
        initial: 0,
        choices: FRAMEWORKS.map((framework) => {
          const frameworkColor = framework.color
          return {
            title: frameworkColor(framework.display || framework.name),
            value: framework,
          }
        }),
      },
      {
        type: 'password',
        name: 'privateKey',
        message: 'Input your private key:',
      },
      {
        type: 'password',
        name: 'pinataJWT',
        message: 'Input your pinata JWT:',
      },
    ], {
      onCancel: () => {
        throw new Error(`${red('✖')} Operation cancelled`)
      },
    })
  }
  catch (error: any) {
    console.log(error.message)
    return
  }
  const { framework, overwrite, packageName, privateKey = '', pinataJWT } = result

  const root = path.join(cwd, targetDir)

  if (overwrite)
    emptyDir(root)

  else if (!fs.existsSync(root))
    fs.mkdirSync(root, { recursive: true })

  // determine template
  const template: string = framework?.name || argTemplate

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

  console.log(`\nScaffolding project in ${root}...`)

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../../templates',
    `template-${template}`,
  )

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content)
      fs.writeFileSync(targetPath, content)

    else
      copy(path.join(templateDir, file), targetPath)
  }

  const files = fs.readdirSync(templateDir)
  for (const file of files.filter(f => f !== 'package.json' || 'zkgraph.config.ts'))
    write(file)

  // write package.json
  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, 'package.json'), 'utf-8'),
  )

  pkg.name = packageName || getProjectName()

  write('package.json', `${JSON.stringify(pkg, null, 2)}\n`)

  // write zkgraph.config.ts
  const realPrivateKey = (privateKey as string).startsWith('0x') ? privateKey : `0x${privateKey}`
  const configContent = generateConfigFileContent(realPrivateKey, pinataJWT)
  write('zkgraph.config.ts', configContent)

  const cdProjectName = path.relative(cwd, root)
  console.log('\nDone. Now run:\n')
  if (root !== cwd) {
    console.log(
      `  cd ${
        cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
      }`,
    )
  }
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn <cmd>')
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run <cmd>`)
      break
  }
  console.log()
  console.log('Read docs: https://github.com/hyperoracle/zkgraph-cli#cli')
  console.log()
}

export async function defaultInit() {
  const argTargetDir = formatTargetDir(argv._[0])
  const argTemplate = argv.template || argv.t
  await init(argTargetDir, argTemplate)
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  )
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-')
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir))
    return

  for (const file of fs.readdirSync(dir)) {
    if (file === '.git')
      continue

    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent)
    return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory())
    copyDir(src, dest)

  else
    fs.copyFileSync(src, dest)
}

