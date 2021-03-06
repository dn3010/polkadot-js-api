const config = require('@polkadot/dev/config/jest');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@sylo/polkadot-api-derive(.*)$': '<rootDir>/packages/api-derive/src/$1',
    '@sylo/polkadot-api(.*)$': '<rootDir>/packages/api/src/$1',
    '@sylo/polkadot-rpc-(core|provider|rx)(.*)$': '<rootDir>/packages/rpc-$1/src/$2',
    '@sylo/polkadot-extrinsics(.*)$': '<rootDir>/packages/type-extrinsics/src/$1',
    '@sylo/polkadot-jsonrpc(.*)$': '<rootDir>/packages/type-jsonrpc/src/$1',
    '@sylo/polkadot-storage(.*)$': '<rootDir>/packages/type-storage/src/$1',
    '@sylo/polkadot-types(.*)$': '<rootDir>/packages/types/src/$1'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/api/build',
    '<rootDir>/packages/api-derive/build',
    '<rootDir>/packages/rpc-core/build',
    '<rootDir>/packages/rpc-provider/build',
    '<rootDir>/packages/rpc-rx/build',
    '<rootDir>/packages/type-extrinsics/build',
    '<rootDir>/packages/type-jsonrpc/build',
    '<rootDir>/packages/type-storage/build/',
    '<rootDir>/packages/types/build'
  ]
});
