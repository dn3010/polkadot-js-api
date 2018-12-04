// Copyright 2017-2018 @polkadot/api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromiseInterface, QueryableStorageFunction, QueryableModuleStorage, QueryableStorage, SubmittableExtrinsics, SubmittableModuleExtrinsics, SubmittableExtrinsicFunction } from './types';

import WsProvider from '@polkadot/rpc-provider/ws';
import Rpc from '@polkadot/rpc-core/index';
import { Storage } from '@polkadot/storage/types';
import { Codec } from '@polkadot/types/types';
import { Extrinsics, ExtrinsicFunction } from '@polkadot/types/Method';
import { StorageFunction } from '@polkadot/types/StorageKey';
import { isFunction } from '@polkadot/util';

import ApiBase from '../Base';
import Combinator, { CombinatorCallback, CombinatorFunction } from './Combinator';
import SubmittableExtrinsic from './SubmittableExtrinsic';

/**
 * # @polkadot/api/promise
 *
 * ## Overview
 *
 * @name ApiPromise
 *
 * @description
 * ApiPromise is a standard JavaScript wrapper around the RPC and interfaces on the Polkadot network. As a full Promise-based, all interface calls return Promises, including the static `.create(...)`. Subscription calls utilise `(value) => {}` callbacks to pass through the latest values.
 *
 * The API is well suited to real-time applications where either the single-shot state is needed or use is to be made of the subscription-based features of Polkadot (and Substrate) clients.
 *
 * @see [[ApiRx]]
 *
 * ## Usage
 *
 * Making rpc calls -
 * <BR>
 *
 * ```javascript
 * import Api from '@polkadot/api/promise';
 *
 * async function main () {
 *   // Initialise via static create
 *   const api = await Api.create();
 *
 *   // Make a subscription to the network head
 *   await api.rpc.chain.subscribeNewHead((header) => {
 *     console.log(`Chain is at best block #${header.blockNumber}`);
 *   });
 * }
 *
 * main().catch(console.error);
 * ```
 * <BR>
 *
 * Subscribing to chain state -
 * <BR>
 *
 * ```javascript
 * import moment from 'moment';
 *
 * import Api from '@polkadot/api/promise';
 * import WsProvider from '@polkadot/rpc-provider/ws';
 *
 * async function main () {
 *   // Initialise a provider with a specific endpoint
 *   const provider = new WsProvider('wss://example.com:9944');
 *
 *   // Initialise via isReady & new with specific provider
 *   const api = await new Api(provider).isReady;
 *
 *   // Retrieve the block target time in type `Moment` and convert into seconds
 *   const blockPeriod = await api.query.timestamp.blockPeriod();
 *   const blockPeriodSeconds = moment(blockPeriod).unix();
 *   let last = 0;
 *
 *   // Subscribe to the current block timestamp, updates automatically (callback provided)
 *   api.query.timestamp.now((timestamp) => {
 *     const timestampSeconds = moment(timestamp).unix();
 *     const elapsed = last
 *       ? `, ${timestampSeconds - last}s since last`
 *       : '';
 *
 *     last = timestampSeconds;
 *     console.log(`Timestamp ${timestampSeconds}${elapsed} (${blockPeriodSeconds}s target)`);
 *   });
 * }
 *
 * main().catch(console.error);
 * ```
 * <BR>
 *
 * Submitting a transaction -
 * <BR>
 *
 * ```javascript
 * import Api from '@polkadot/api/promise';
 * import Keyring from '@polkadot/keyring';
 * import stringToU8a from '@polkadot/util';
 *
 * const ALICE_SEED = 'Alice'.padEnd(32, ' ');
 * const BOB_ADDR = '5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE';
 *
 * async function main () {
 *   const api = await ApiPromise.create();
 *
 *   // Create an instance of the keyring
 *   const keyring = new Keyring();
 *
 *   // Add Alice to our keyring (with the known seed for the account)
 *   const alice = keyring.addFromSeed(stringToU8a(ALICE_SEED));
 *
 *   // Retrieve the nonce for Alice
 *   const nonce = await api.query.system.accountNonce(alice.address());
 *
 *   api.tx.balances
 *     // Create transfer
 *     transfer(BOB_ADDR, 12345)
 *     // Sign the transcation
 *     .sign(alice, nonce)
 *     // Send the transaction (optional status callback)
 *     .send((status) => {
 *       console.log(`Current status ${status.type}`);
 *     })
 *     // Retrieve the submitted extrinsic hash
 *     .then((hash) => {
 *       console.log(`Submitted with hash ${hash}`);
 *     });
 * };
 *
 * main().catch(console.error);
 * ```
 */
export default class ApiPromise extends ApiBase<Rpc, QueryableStorage, SubmittableExtrinsics> implements ApiPromiseInterface {
  private _isReady: Promise<ApiPromise>;

  /**
   * @description Creates an ApiPromise instance using the supplied provider. Returns an Promise containing the actual Api instance.
   *
   * @param wsProvider WebSocket provider that is passed to the class contructor
   *
   * @example
   * <BR>
   *
   * ```javascript
   * import Api from '@polkadot/api/promise';
   *
   * Api.create().then(async (api) => {
   *   const timestamp = await api.query.timestamp.now();
   *
   *   console.log(`lastest block timestamp ${timestamp}`);
   * });
   * ```
   */
  static create (wsProvider?: WsProvider): Promise<ApiPromise> {
    return new ApiPromise(wsProvider).isReady;
  }

  /**
   * @description Creates an instance of the ApiPromise class
   *
   * @param wsProvider WebSocket provider from rpc-provider/ws. If not specified, it will default to connecting to the localhost with the default port, i.e. `ws://127.0.0.1:9944`
   *
   * @example
   * <BR>
   *
   * ```javascript
   * import Api from '@polkadot/api/promise';
   *
   * new Api().isReady.then((api) => {
   *   api.rpc.subscribeNewHead((header) => {
   *     console.log(`new block #${header.blockNumber.toNumber()}`);
   *   });
   * });
   * ```
   */
  constructor (wsProvider?: WsProvider) {
    super(wsProvider);

    this._isReady = new Promise((resolveReady) =>
      super.on('ready', () =>
        resolveReady(this)
      )
    );
  }

  /**
   * @description Promise that returns the first time we are connected and loaded
   */
  get isReady (): Promise<ApiPromise> {
    return this._isReady;
  }

  protected decorateRpc (rpc: Rpc): Rpc {
    return rpc;
  }

  /**
   * @description Creates a combinator that can be used to combine the latest results from multiple subscriptions
   * @param fns An array of function to combine, each in the form of `(cb: (value: void)) => void`
   * @param callback A callback that will return an Array of all the values this combinator has been applied to
   * @example
   * <BR>
   *
   * ```javascript
   * const address = '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFacT7';
   *
   * // combines values from balance & nonce as it updates
   * api.combineLatest([
   *   (cb) => api.rpc.chain.subscribeNewHead(cb),
   *   (cb) => api.query.balances.freeBalance(address, cb),
   *   (cb) => api.query.system.accountNonce(address, cb)
   * ], ([head, balance, nonce]) => {
   *   console.log(`#${head.number}: You have ${balance} units, with ${nonce} transactions sent`);
   * });
   * ```
   */
  combineLatest (fns: Array<CombinatorFunction>, callback: CombinatorCallback): Combinator {
    return new Combinator(fns, callback);
  }

  protected decorateExtrinsics (extrinsics: Extrinsics): SubmittableExtrinsics {
    return Object.keys(extrinsics).reduce((result, sectionName) => {
      const section = extrinsics[sectionName];

      result[sectionName] = Object.keys(section).reduce((result, methodName) => {
        result[methodName] = this.decorateExtrinsicEntry(section[methodName]);

        return result;
      }, {} as SubmittableModuleExtrinsics);

      return result;
    }, {} as SubmittableExtrinsics);
  }

  private decorateExtrinsicEntry (method: ExtrinsicFunction): SubmittableExtrinsicFunction {
    const decorated: any = (...args: Array<any>): SubmittableExtrinsic =>
      new SubmittableExtrinsic(this, method(...args));

    return this.decorateFunctionMeta(method, decorated) as SubmittableExtrinsicFunction;
  }

  protected decorateStorage (storage: Storage): QueryableStorage {
    return Object.keys(storage).reduce((result, sectionName) => {
      const section = storage[sectionName];

      result[sectionName] = Object.keys(section).reduce((result, methodName) => {
        result[methodName] = this.decorateStorageEntry(section[methodName]);

        return result;
      }, {} as QueryableModuleStorage);

      return result;
    }, {} as QueryableStorage);
  }

  private decorateStorageEntry (method: StorageFunction): QueryableStorageFunction {
    const decorated: any = (...args: Array<any>): Promise<Codec | null | undefined> => {
      if (args.length === 0 || !isFunction(args[args.length - 1])) {
        return this.rpc.state.getStorage([method, args[0]]);
      }

      return this.rpc.state.subscribeStorage(
        [[method, args.length === 1 ? undefined : args[0]]],
        (result: Array<Codec | null | undefined> = []) =>
          args[args.length - 1](result[0])
      );
    };

    return this.decorateFunctionMeta(method, decorated) as QueryableStorageFunction;
  }
}
