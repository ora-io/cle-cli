import { ZKGraphRequireFailed } from './error'
import { fromHexString, toHexString } from './utils'

/* eslint-disable no-console */
export class HostMemory {
  mem: Uint8Array
  writecur: number
  readcur: number
  view: DataView
  constructor(max_size: number) {
    this.mem = new Uint8Array(max_size)
    this.writecur = 0
    this.readcur = 0
    this.view = new DataView(this.mem.buffer)
  }

  push(data: string | any[] | Uint8Array, little_endian = true) {
    if (little_endian) {
      for (let i = 0; i < data.length; i++)
        this.mem[this.writecur + i] = data[i]
    }
    else {
      for (let i = 0; i < data.length; i++)
        this.mem[this.writecur + data.length - 1 - i] = data[i]
    }
    this.writecur += data.length
  }

  push_align(data: string | any[] | Uint8Array, little_endian = true) {
    const padlen = Math.ceil(data.length / 8) * 8 - data.length
    this.push(data, little_endian)
    this.push(new Uint8Array(padlen))
  }

  write_once(data: string | any[] | Uint8Array, type: string | ErrorOptions | undefined) {
    // eslint-disable-next-line eqeqeq
    if (type == 'i64') {
      this.push_align(data, false)
    }
    // eslint-disable-next-line eqeqeq
    else if (type == 'bytes-packed') {
      this.push_align(data, true)
    }
    else {
      throw new Error(
        `zkwasm mock: data type (${
        type
        }) not supported, please file an issue if you think it should be supported.`,
      )
    }
  }

  write_from_input(str: string) {
    const args = str.split(' ')
    for (const i in args) {
      // eslint-disable-next-line eqeqeq
      if (args[i].length == 0)
        continue
      const _arg = args[i].split(':')
      if (_arg.length > 2)
        throw new Error(`multiple ':' in "${args[i]}"`)
      const [d, t] = [_arg[0], _arg[1]]
      this.write_once(fromHexString(d), t)
    }
  }

  print(title = '') {
    console.log(`---------------${title}---------------`)
    console.log(`>> total length: ${this.writecur}`)
    console.log('>> data: ')
    console.log(toHexString(this.mem.slice(0, this.writecur)))
    console.log(`------------------------------${'-'.repeat(title.length)}`)
  }

  read_i64() {
    this.readcur += 8
    return this.view.getBigUint64(this.readcur - 8, true)
  }
}
export class ZKWASMMock {
  privateMem: HostMemory
  publicMem: HostMemory
  constructor(max_pri_size = 100000000, max_pub_size = 1000) {
    this.privateMem = new HostMemory(max_pri_size)
    this.publicMem = new HostMemory(max_pub_size)
  }

  set_private_input(str: string) {
    this.privateMem.write_from_input(str)
  }

  set_public_input(str: string) {
    this.publicMem.write_from_input(str)
  }

  static require(a: any) {
    if (!a) {
    //   console.log("[-] zkwasm require condition is false");
      throw new ZKGraphRequireFailed('Abort execution since the require condition is false.')
      // TODO: change to graceful kill rather than throw Error?
    }
  }

  wasm_input(a: number | ErrorOptions | undefined) {
    // eslint-disable-next-line eqeqeq
    if (a == 0)
      return this.privateMem.read_i64()
    // eslint-disable-next-line eqeqeq
    else if (a == 1)
      return this.publicMem.read_i64()
    else throw new Error(`zkwasm mock: wasm_input is invalid: ${a}`)
  }
}
