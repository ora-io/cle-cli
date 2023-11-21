import yaml from 'js-yaml'

/**
 * Parse yaml
 * @param content
 * @returns
 */
export async function parseYaml<T = any>(content: string) {
  return new Promise<T>((resolve, reject) => {
    try {
      resolve(yaml.load(content) as T)
    }
    catch (e) {
      reject(e)
    }
  })
}

