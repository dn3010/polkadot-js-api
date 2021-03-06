// Copyright 2017-2019 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Set from '../codec/Set';

/**
 * @name WithdrawReasons
 * @description
 * The Substrate WithdrawReasons for staking
 */
export default class WithdrawReasons extends Set {
  constructor (value: any = ['header', 'body', 'justification']) {
    super({
      TransactionPayment: 0b00000001,
      Transfer: 0b00000010,
      Reserve: 0b00000100
    }, value);
  }

  /**
   * @description In order to reserve some funds for a later return or repatriation
   */
  get isReserve (): boolean {
    return this.values.includes('Reserve');
  }

  /**
   * @description In order to pay for (system) transaction costs
   */
  get isTransactionPayment (): boolean {
    return this.values.includes('TransactionPayment');
  }

  /**
   * @description In order to transfer ownership
   */
  get isTransfer (): boolean {
    return this.values.includes('Transfer');
  }
}
