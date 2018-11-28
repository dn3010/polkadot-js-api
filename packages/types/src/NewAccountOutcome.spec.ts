// Copyright 2017-2018 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import NewAccountOutcome from './NewAccountOutcome';

describe('NewAccountOutcome', () => {
  it('allows setting value in constructor', () => {
    expect(
      new NewAccountOutcome(2).toNumber()
    ).toEqual(2);
  });
});
