import { ZKWASMMock } from './zkwasm_mock'

/* eslint-disable no-console */
export async function instantiate(module: any, imports: any = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      'console.log': function (text: any) {
        // ~lib/bindings/dom/console.log(~lib/string/String) => void
        // text = __liftString(text >>> 0)
        console.log(text)
      },
      require(x: any) {
        // sdk/zkwasm/require1(i32) => i64
        ZKWASMMock.require(x)
      },
      wasm_input(_x: any) {
        // lib/common/zkwasm/wasm_input(i32) => i64
        return 0n
      },
      js_log(arg: any) {
        // to compatible with c-wasm
        console.log(arg)
      },
      js_log_u64(arg: any) {
        // to compatible with c-wasm
        console.log(arg)
      },
    }),
  }
  // @ts-expect-error unknown
  const { exports } = await WebAssembly.instantiate(module, adaptedImports)
  return exports
}

export const instantiateWasm = async (wasmUnit8Array: Uint8Array) => {
  return instantiate(
    await (async () => {
      return globalThis.WebAssembly.compile(
        wasmUnit8Array.buffer,
      )
    })(),
    {},
  )
}
