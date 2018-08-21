import TrezorSubProvider from './vendor/trezor-subprovider';

const defaultDerivationPath = "44'/60'/0'/0/0";

export default function(maker) {
  maker.service('accounts', true).addAccountType('trezor', async settings => {
    const subprovider = TrezorSubProvider({
      // options: networkId, path, accountsLength, accountsOffset
      path: settings.path || defaultDerivationPath
    });

    const address = await new Promise((resolve, reject) =>
      subprovider.getAccounts((err, addresses) =>
        err ? reject(err) : resolve(addresses[0])));

    return { subprovider, address };
  });
}
