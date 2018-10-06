import TrezorSubProvider from './vendor/trezor-subprovider';

const defaultDerivationPath = "44'/60'/0'/0/0";

export default function(maker) {
  maker.service('accounts', true).addAccountType('trezor', async settings => {
    const subprovider = TrezorSubProvider({
      // options: networkId, path, accountsLength, accountsOffset
      accountsLength: settings.accountsLength || 1,
      path: settings.path || defaultDerivationPath
    });

    let address;

    if (settings.accountsLength && settings.accountsLength > 1) {
      if (!settings.choose) {
        throw new Error(
          'If accountsLength > 1, "choose" must be defined in account options.'
        );
      }

      const addresses = await new Promise((resolve, reject) =>
        subprovider.getAccounts(
          (err, addresses) => (err ? reject(err) : resolve(addresses))
        )
      );

      address = await new Promise((resolve, reject) => {
        const callback = (err, address) =>
          err ? reject(err) : resolve(address);

        // this chooser function allows the app using the plugin to display the
        // list of addresses to a human user and let them make a choice.
        settings.choose(
          Object.keys(addresses).map(k => addresses[k]),
          callback
        );
      });
    } else {
      address = await new Promise((resolve, reject) =>
        subprovider.getAccounts(
          (err, addresses) => (err ? reject(err) : resolve(addresses[0]))
        )
      );
    }

    return { subprovider, address };
  });
}
