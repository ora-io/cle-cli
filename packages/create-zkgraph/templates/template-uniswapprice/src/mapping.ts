//@ts-ignore
import { require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Event, BigInt } from "@hyperoracle/zkgraph-lib";

var esig_sync = Bytes.fromHexString(
  "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
);
var esig_swap = Bytes.fromHexString(
  "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
);

var token0_decimals = 6;
var token1_decimals = 18;
var price_decimals = 3;

var threshold_eth_price = 1880;

var token0_factor = BigInt.from(10).pow(token1_decimals);
var token1_factor = BigInt.from(10).pow(token0_decimals);
var price_factor = BigInt.from(10).pow(price_decimals);

function calcPrice(syncEvent: Event): BigInt {
  const source = changetype<Bytes>(syncEvent.data);
  const reserve0 = source.slice(0, 32);
  const reserve1 = source.slice(32, 64);

  const r0 = BigInt.fromBytesBigEndian(reserve0);
  const r1 = BigInt.fromBytesBigEndian(reserve1);
  let price0 = r0
    .times(token0_factor)
    .times(price_factor)
    .div(r1.times(token1_factor));

  return price0;
}

export function handleEvents(events: Event[]): Bytes {
  let lastSyncEvent: Event | null = null;

  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].esig == esig_sync) {
      //   console.log('SYNC event');
      lastSyncEvent = events[i];
      break;
    }
  }

  if (lastSyncEvent == null) {
    // Don't Trigger if there's no event in the block
    require(false);
    return Bytes.empty(); // Omit compile error, never goes here
  } else {
    let price0 = calcPrice(lastSyncEvent);

    // console.log("Current price is: " + (price0.toI64() / 10**price_decimals).toString() + "." + (price0.toI64() % 10**price_decimals).toString())

    // Only Trigger when price > pre-defined threshold
    let triggerCondition = price0.ge(
      BigInt.fromI32(threshold_eth_price * 10 ** price_decimals),
    );
    require(triggerCondition);

    // Set payload to the current price0 when triggering destination contract.
    let payload = Bytes.fromHexString(price0.toString(16)).padStart(32, 0);
    return payload;
  }
}
