import TrezorSubProvider from './hw-wallet/vendor/trezor-subprovider';

const defaultDerivationPath = "44'/60'/0'/0/0";

export default function(maker) {
  console.log('Setting up Trezor support...');

  maker.service('accounts', true).addAccountType('trezor', async settings => {
    const subprovider = TrezorSubProvider({
      // options: networkId, path, accountsLength, accountsOffset
      path: settings.path || defaultDerivationPath
    });

    const address = await new Promise(resolve =>
      subprovider.getAccounts(addresses => resolve(addresses[0])));

    return { subprovider, address };
  });
}
