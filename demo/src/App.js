import React, { Component } from 'react';
import './App.css';
import setupMaker from './setupMaker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: "44'/60'/0'/0/0",
      accounts: [],
      cdps: []
    };
  }

  componentDidMount() {
    setupMaker().then(maker => {
      this.setState({ maker });
      this.updateAccounts(maker);
    });
  }

  async updateAccounts(maker) {
    if (!maker) maker = this.state.maker;
    const accounts = await Promise.all(
      maker.listAccounts().map(async account => {
        return {
          ...account,
          balance: await maker.getToken('ETH').balanceOf(account.address)
        };
      })
    );
    this.setState({
      accounts,
      currentAccount: maker.currentAccount()
    });
  }

  findTrezor = async () => {
    const { maker, path } = this.state;
    try {
      await maker.addAccount('myTrezor', {
        type: 'trezor',
        path
      });
      await this.updateAccounts();
    } catch(err) {
      alert("Couldn't add Trezor: " + err.message);
    }
  };

  useAccount = async name => {
    const { maker } = this.state;
    maker.useAccount(name);
    await this.updateAccounts();
  };

  openCdp = async () => {
    const { maker } = this.state;
    const cdp = await maker.openCdp();
    const id = await cdp.getId();
    const info = await cdp.getInfo();
    this.setState(({ cdps }) => ({
      cdps: [...cdps, { id, owner: info.lad.toLowerCase() }]
    }));
  };

  fund = async name => {
    const { accounts, maker, funder } = this.state;
    if (!funder) return alert('Pick a funder first.');
    const sender = accounts.find(a => a.name === funder);
    const receiver = accounts.find(a => a.name === name);
    if (receiver === sender) return alert('Fund a different account.');
    maker.useAccount(sender.name);
    await maker.getToken('ETH').transfer(receiver.address, 1);
    await this.updateAccounts();
  };

  render() {
    const { accounts, currentAccount, path, cdps, funder } = this.state;
    return (
      <div>
        <h3>Demo: Multiple accounts &amp; hardware wallet integration</h3>
        <h4>Accounts</h4>
        <AccountTable
          {...{ accounts, currentAccount }}
          useAccount={this.useAccount}
          fund={this.fund}
          funder={funder}
          setFunder={name => this.setState({ funder: name })}
        />
        <button onClick={this.findTrezor}>Connect to Trezor</button>{' '}
        <label>
          derivation path:{' '}
          <input
            type="text"
            value={path}
            onChange={ev => this.setState({ path: ev.target.value })}
          />
        </label>
        <br />
        <br />
        <button onClick={this.openCdp}>
          Open a CDP using the selected account
        </button>
        <h4>CDPs created</h4>
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>owner</th>
            </tr>
          </thead>
          <tbody>
            {cdps.map(({ id, owner }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;

const AccountTable = ({
  accounts,
  currentAccount,
  useAccount,
  fund,
  funder,
  setFunder
}) => (
  <table>
    <thead>
      <tr>
        <th>name</th>
        <th>type</th>
        <th>address</th>
        <th>ETH balance</th>
        <th>funder</th>
      </tr>
    </thead>
    <tbody>
      {accounts.map(({ name, address, balance, type }) => (
        <tr key={name}>
          <td>{name}</td>
          <td>{type}</td>
          <td>{address}</td>
          <td>{balance}</td>
          <td>
            <input
              type="radio"
              name={name}
              onClick={() => setFunder(name)}
              checked={name === funder}
            />
          </td>
          <td className="buttons">
            {name === currentAccount.name ? (
              <button disabled>In use</button>
            ) : (
              <button onClick={() => useAccount(name)}>Use</button>
            )}
            <button onClick={() => fund(name)}>Fund</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
