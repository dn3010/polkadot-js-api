// Import the API Rx
const { ApiRx } = require('@polkadot/api');
const { WsProvider } = require('@polkadot/rpc-provider');

const wsProvider = new WsProvider('ws://127.0.0.1:9944');

export default async function exampleApiRx () {
  // Here we pass the (optional) provider
  ApiRx.create(wsProvider).subscribe((api) => {
    // Use the RPC Node Interface
    api.rpc.subscribeNewHead().subscribe((header) => {
      console.log(`best #${header.blockNumber.toNumber()}`);
    });
  });
}
