//@ts-ignore
import { Bytes, Block } from "@hyperoracle/zkgraph-lib";

export function handleBlocks(blocks: Block[]): Bytes {
  return Bytes.fromUTF8("Hello zkGraph!");
}
