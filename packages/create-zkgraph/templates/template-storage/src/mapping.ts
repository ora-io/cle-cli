//@ts-ignore
import { require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Account, Block, Slot } from "@hyperoracle/zkgraph-lib";

let addr = Bytes.fromHexString('0xa60ecf32309539dd84f27a9563754dca818b815e');
let key = Bytes.fromHexString('0x0000000000000000000000000000000000000000000000000000000000000008');

export function handleBlocks(blocks: Block[]): Bytes{
  // get source Account object by address
  let acct: Account = blocks[0].account(addr);

  // require on key existence
  require(acct.hasSlot(key));

  // #1 get source Slot object by key
  let value:Bytes = acct.storage(key);

  // #2 get source Slot object by key
  let slot: Slot = acct.slots[acct.getSlotId(key)]

  // this 2 ways to get slot value are equal effect, so always true
  require(value == slot.value);

  // return the slot value of the given block
  return value;
}