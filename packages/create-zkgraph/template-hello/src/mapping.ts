//@ts-ignore
import { require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Event, BigInt, ByteArray } from "@hyperoracle/zkgraph-lib";

export function handleEvents(events: Event[]): Bytes {
  return Bytes.fromUTF8("Hello zkGraph!");
}
