// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import H512 from './H512';

// The default signature that is used across the system. It is currectly defined
// as a 512-bit value, represented by a hash.
export default class Signature extends H512 {
}
