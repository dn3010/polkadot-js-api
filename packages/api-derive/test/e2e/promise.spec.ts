// Copyright 2017-2019 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiPromise from '@sylo/polkadot-api/promise/Api';
import { BlockNumber } from '@sylo/polkadot-types';
import { WsProvider } from '@sylo/polkadot-rpc-provider';

const WS_LOCAL = 'ws://127.0.0.1:9944/';
// const WS_POC3 = 'wss://poc3-rpc.polkadot.io/';

describe.skip('derive e2e', () => {
  let api: ApiPromise;

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  beforeEach(async (done) => {
    api = await ApiPromise.create(new WsProvider(WS_LOCAL));
    done();
  });

  it('returns correct results', async () => {
    // https://github.com/polkadot-js/api/issues/777
    const block1 = await api.derive.chain.bestNumber();
    await new Promise((resolve) => setTimeout(resolve, 15000));
    const block2 = await api.derive.chain.bestNumber();

    expect((block1 as BlockNumber).eq(block2)).toBe(false);
  });
});
