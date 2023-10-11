import { Bytes, require } from '@hyperoracle/zkgraph-lib'
import type { Event } from '@hyperoracle/zkgraph-lib'

export function handleEvents(events: Event[]): Bytes {
  let state = new Bytes(0)
  if (events.length > 0)
    state = events[0].address

  require(state.length === 20)
  return state
}
