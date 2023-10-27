//@ts-ignore
import { require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Event, BigInt } from "@hyperoracle/zkgraph-lib";

var addr_Sync = Bytes.fromHexString(
  "0xa60ecf32309539dd84f27a9563754dca818b815e",
);
var esig_Sync = Bytes.fromHexString(
  "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
);

var addr_SubmissionReceived = Bytes.fromHexString(
  "0x5c7a6cf20cbd3eef32e19b9cad4eca17c432a794",
);
var esig_SubmissionReceived = Bytes.fromHexString(
  "0x92e98423f8adac6e64d0608e519fd1cefb861498385c6dee70d58fc926ddc68c",
);

export function handleEvents(events: Event[]): Bytes {
  let countMatched = 0;
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].address == addr_Sync && events[i].esig == esig_Sync) {
      countMatched += 1;
    }
    if (
      events[i].address == addr_SubmissionReceived &&
      events[i].esig == esig_SubmissionReceived
    ) {
      countMatched += 1;
    }
  }
  require(countMatched == 4);

  let state = new Bytes(1);
  state[0] = countMatched;

  return state;
}
