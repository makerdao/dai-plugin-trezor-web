import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
const Maker = require('@makerdao/dai');

// These are keys that are set up in our test chain with some Ether.
const keys = [
  // address: 0x8a002199541f32d49f8a12fc5c307bef74436929
  'b178ad06eb08e2cd34346b5c8ec06654d6ccb1cadf1c9dbd776afd25d44ab8d0',
  // address: 0xfb803892d9db69ff03a4039802021e753f0b40de
  '819d5a9152a1aa37b514d13f861d5e53aae810eedd3876f3f9aaf9e6bcb7c2bb'
];

export default async function(useMetaMask) {
  window.Maker = Maker;

  let maker;
  if (useMetaMask) {
    maker = Maker.create('browser', {
      plugins: [trezorPlugin],
      accounts: {
        myMetamask: { type: 'provider' },
        foo: { type: 'privateKey', key: keys[0] },
        bar: { type: 'privateKey', key: keys[1] }
      }
    });
  } else {
    maker = Maker.create('http', {
      url: 'http://localhost:2000',
      plugins: [trezorPlugin],
      accounts: {
        myMetamask: { type: 'browser' },
        foo: { type: 'privateKey', key: keys[0] },
        bar: { type: 'privateKey', key: keys[1] }
      }
    });
  }

  await maker.authenticate();
  window.maker = maker;
  if (maker.service('web3').networkId() !== 999) {
    alert(
      'To work with testchain accounts, configure MetaMask to use "Custom RPC" with address "http://localhost:2000".'
    );
  }
  return maker;
}
