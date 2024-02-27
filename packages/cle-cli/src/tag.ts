/**
 * e.g. [root]build/xxx.wasm
 * parse to project root path/xxx.wasm
 * @param template
 * @param tags
 * @returns
 */
export function parseTemplateTag(template: string, tags: Record<string, string>) {
  const value = template.replace(/\[(\w+)\]/g, (_, key) => {
    const isExistTag = Reflect.has(tags, key)
    const value = isExistTag ? tags[key] : `[${key}]`
    return value
  })
  return value
}
