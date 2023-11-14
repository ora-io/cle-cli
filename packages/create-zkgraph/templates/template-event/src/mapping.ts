//@ts-ignore
import { require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Block, Event } from "@hyperoracle/zkgraph-lib";

let addr = Bytes.fromHexString('0xa60ecf32309539dd84f27a9563754dca818b815e');
let esig_sync = Bytes.fromHexString("0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1");

export function handleBlocks(blocks: Block[]): Bytes {
  // init output state
  let state: Bytes;

  // #1 can access all (matched) events of the latest block
  let events: Event[] = blocks[0].events;

  // #2 also can access (matched) events of a given account address (should present in yaml first).
  // a subset of 'events'
  let eventsByAcct: Event[] = blocks[0].account(addr).events;

  // #3 also can access (matched) events of a given account address & a given esig  (should present in yaml first).
  // a subset of 'eventsByAcct'
  let eventsByAcctEsig: Event[] = blocks[0].account(addr).eventsByEsig(esig_sync)

  // require match event count > 0
  require(eventsByAcctEsig.length > 0)

  // this 2 way to access event are equal effects, alway true when there's only 1 event matched in the block (e.g. block# 2279547 on sepolia).
  require(
    events[0].data == eventsByAcct[0].data 
    && events[0].data == eventsByAcctEsig[0].data
  );

  // set state to the address of the 1st (matched) event, demo purpose only.
  state = events[0].address;

  return state
}
