import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  rollup: {
    inlineDependencies: true,
    emitCJS: true,
    esbuild: {
      target: 'node18',
      minify: true,
    },
  },
  declaration: true,
  alias: {
    prompts: 'prompts/lib/index.js',
  },
})
