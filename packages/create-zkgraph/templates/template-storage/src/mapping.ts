import { Bytes, Block, Account, Slot, Event, require } from '@hyperoracle/zkgraph-lib'

let addr = '0xa60ecf32309539dd84f27a9563754dca818b815e';
let key = Bytes.fromHexString('0x0000000000000000000000000000000000000000000000000000000000000008');

export function handleBlocks(blocks: Block[]): Bytes{
    return blocks[0].account(Bytes.fromHexString(addr)).storage(key);
}

