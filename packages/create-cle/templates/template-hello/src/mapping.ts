//@ts-ignore
import { Bytes, Block } from "@hyperoracle/cle-lib-test";

export function handleBlocks(blocks: Block[]): Bytes {
  return Bytes.fromUTF8("Hello CLE!");
}