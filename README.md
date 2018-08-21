# dai-plugin-trezor-web
A [Dai.js](daijs) plugin for using Trezor in a browser environment.

### Example usage

```js
import TrezorPlugin from '@makerdao/dai-plugin-trezor-web';
import Maker from '@makerdao/dai';

// this will trigger the Trezor popup immediately
const maker = Maker.create('http', {
  plugins: [TrezorPlugin],
  accounts: {
    // derivation path can be omitted; the default value is shown
    myTrezor1: { type: 'trezor', path: "44'/60'/0'/0/0" } 
  }
});

// this will not resolve until the Trezor user interaction is complete
await maker.authenticate();

// or you can defer showing the Trezor popup until later
await maker.addAccount('myTrezor2', { type: 'trezor' };
```

### Try the demo app

The demo app is set up to work with the Dai.js [test chain](testchain). You can add a Trezor account, transfer ETH between all three accounts, and open CDPs with any of them.

```shell
cd demo
yarn install
yarn start
```

[daijs]: https://github.com/makerdao/dai.js
[testchain]: https://github.com/makerdao/dai.js/blob/dev/testchain/scripts/with-deployed-system
