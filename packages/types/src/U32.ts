// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AnyNumber } from './types';

import UInt from './codec/UInt';

/**
 * @name U32
 * @description
 * An 32-bit number
 */
export default class U32 extends UInt {
  constructor (value?: AnyNumber) {
    super(value, 32, false);
  }
}
