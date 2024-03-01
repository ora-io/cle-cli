//@ts-ignore
import { console } from "@ora-io/cle-lib";
import { Bytes, Block } from "@ora-io/cle-lib";

export function handleBlocks(blocks: Block[]): Bytes {
  console.log("Entering handleBlocks...");
  return Bytes.fromUTF8("Hello CLE!");
}
