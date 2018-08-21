import React, { Component } from 'react';
import './App.css';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
const Maker = require('@makerdao/dai');

async function setupMaker() {
  window.Maker = Maker;

  const maker = Maker.create('http', {
    url: 'http://localhost:2000',
    plugins: [trezorPlugin],
    accounts: {
      // default: { type: 'metamask' },
      foo: {
        type: 'privateKey',
        key: 'b178ad06eb08e2cd34346b5c8ec06654d6ccb1cadf1c9dbd776afd25d44ab8d0'
        // address: 0x8a002199541f32d49f8a12fc5c307bef74436929
      }
    }
  });

  await maker.authenticate();
  console.log(
    'current address is ' + maker.service('accounts').currentAddress()
  );

  // we can add an account in the initial config, but also after maker is
  // initialized. this allows us to control when the Trezor popup appears.
  // type 'trezor' is valid only because TrezorPlugin is loaded.

  await maker.addAccount('myTrezor1', {
    type: 'trezor',
    path: "44'/60'/0'/0/1"
  });

  // switch accounts, do something
  // maker.useAccount('metamask');

  // switch back, do something else
  // maker.useAccount('trezor2');
  return maker;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setupMaker().then(maker => {
      this.setState({ maker });
    });
  }

  render() {
    return <div>Makers gonna make</div>;
  }
}

export default App;
