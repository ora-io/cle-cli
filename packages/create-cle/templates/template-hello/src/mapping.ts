//@ts-ignore
import { Bytes, Block } from "@ora-io/cle-lib";

export function handleBlocks(blocks: Block[]): Bytes {
  return Bytes.fromUTF8("Hello CLE!");
}
