'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = createTrezorSubprovider;

var _hookedWallet = require('web3-provider-engine/dist/es5/subproviders/hooked-wallet');

var _hookedWallet2 = _interopRequireDefault(_hookedWallet);

var _ethereumjsTx = require('ethereumjs-tx');

var _ethereumjsTx2 = _interopRequireDefault(_ethereumjsTx);

var _addressGenerator = require('./address-generator');

var _addressGenerator2 = _interopRequireDefault(_addressGenerator);

var _trezorConnect = require('./trezor-connect');

var _trezorConnect2 = _interopRequireDefault(_trezorConnect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
var allowedHdPaths = ["44'/1'", "44'/60'", "44'/61'"];

function makeError(msg, id) {
  var err = new Error(msg);
  // $FlowFixMe
  err.id = id;
  return err;
}

function obtainPathComponentsFromDerivationPath(derivationPath) {
  // check if derivation path follows 44'/60'/x'/n pattern
  var regExp = /^(44'\/(?:1|60|61)'\/\d+'\/\d+?\/)(\d+)$/;
  var matchResult = regExp.exec(derivationPath);
  if (matchResult === null) {
    throw makeError("To get multiple accounts your derivation path must follow pattern 44'/60|61'/x'/n ", 'InvalidDerivationPath');
  }
  return { basePath: matchResult[1], index: parseInt(matchResult[2], 10) };
}

var defaultOptions = {
  networkId: 1, // mainnet
  path: "44'/60'/0'/0/0", // trezor default derivation path
  accountsLength: 1,
  accountsOffset: 0
};

/**
 * Create a HookedWalletSubprovider for Trezor devices.
 */
function createTrezorSubprovider(options) {
  var _getAccounts = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var addressGenerator, addresses, i, _path, address;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (alreadyOpenTrezorModal) {
                _context.next = 11;
                break;
              }

              alreadyOpenTrezorModal = true;
              _context.next = 5;
              return createAddressGenerator('m/' + pathComponents.basePath.slice(0, pathComponents.basePath.length - 1));

            case 5:
              addressGenerator = _context.sent;
              addresses = {};

              for (i = accountsOffset; i < accountsOffset + accountsLength; i++) {
                _path = pathComponents.basePath + (pathComponents.index + i).toString();
                address = addressGenerator.getAddressString(i);

                addresses[_path] = address;
                addressToPathMap[address.toLowerCase()] = _path;
              }
              return _context.abrupt('return', addresses);

            case 11:
              return _context.abrupt('return', (0, _keys2.default)(addressToPathMap).reduce(function (obj, key) {
                obj[addressToPathMap[key]] = key;
                return obj;
              }, {}));

            case 12:
              _context.next = 17;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context['catch'](0);
              throw makeError(_context.t0);

            case 17:
              _context.prev = 17;
              return _context.finish(17);

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 14, 17, 19]]);
    }));

    return function _getAccounts() {
      return _ref.apply(this, arguments);
    };
  }();

  var _signPersonalMessage = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(msgData) {
      var path, result;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              path = addressToPathMap[msgData.from.toLowerCase()];

              if (path) {
                _context2.next = 3;
                break;
              }

              throw new Error('address unknown \'' + msgData.from + '\'');

            case 3:
              _context2.prev = 3;
              _context2.next = 6;
              return trezorSignMessage(path, msgData.data);

            case 6:
              result = _context2.sent;
              return _context2.abrupt('return', '0x' + result.signature);

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2['catch'](3);
              throw makeError(_context2.t0);

            case 13:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[3, 10]]);
    }));

    return function _signPersonalMessage(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var _signTransaction = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(txData) {
      var path, tx, result, signedChainId, validChainId;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              path = 'm/' + addressToPathMap[txData.from.toLowerCase()];

              if (path) {
                _context3.next = 3;
                break;
              }

              throw new Error('address unknown \'' + txData.from + '\'');

            case 3:
              _context3.prev = 3;
              tx = new _ethereumjsTx2.default(txData);
              _context3.next = 7;
              return trezorSignTransaction(path, txData);

            case 7:
              result = _context3.sent;


              tx.v = Buffer.from(result.v.toString(16), 'hex');
              tx.r = Buffer.from(result.r, 'hex');
              tx.s = Buffer.from(result.s, 'hex');

              // EIP155: v should be chain_id * 2 + {35, 36}
              signedChainId = Math.floor((tx.v[0] - 35) / 2);
              validChainId = networkId & 0xff; // FIXME this is to fixed a current workaround that app don't support > 0xff

              if (!(signedChainId !== validChainId)) {
                _context3.next = 15;
                break;
              }

              throw makeError('Invalid networkId signature returned. Expected: ' + networkId + ', Got: ' + signedChainId, 'InvalidNetworkId');

            case 15:
              return _context3.abrupt('return', '0x' + tx.serialize().toString('hex'));

            case 18:
              _context3.prev = 18;
              _context3.t0 = _context3['catch'](3);
              throw makeError(_context3.t0);

            case 21:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[3, 18]]);
    }));

    return function _signTransaction(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();

  var _defaultOptions$optio = (0, _extends3.default)({}, defaultOptions, options),
      networkId = _defaultOptions$optio.networkId,
      path = _defaultOptions$optio.path,
      accountsLength = _defaultOptions$optio.accountsLength,
      accountsOffset = _defaultOptions$optio.accountsOffset;

  if (!allowedHdPaths.some(function (hdPref) {
    return path.startsWith(hdPref);
  })) {
    throw makeError('Trezor derivation path allowed are ' + allowedHdPaths.join(', ') + '. ' + path + ' is not supported', 'InvalidDerivationPath');
  }

  var pathComponents = obtainPathComponentsFromDerivationPath(path);

  var addressToPathMap = {};

  var createAddressGenerator = function createAddressGenerator(derivationPath) {
    return new _promise2.default(function (resolve, reject) {
      _trezorConnect2.default.setCurrency('ETH');
      _trezorConnect2.default.getXPubKey(derivationPath, function (result) {
        if (result.success) {
          resolve(new _addressGenerator2.default(result));
        } else {
          reject(new Error(result.error));
        }
      });
    });
  };

  var alreadyOpenTrezorModal = false;

  function trezorSignMessage(path, data) {
    return new _promise2.default(function (resolve, reject) {
      _trezorConnect2.default.ethereumSignMessage(path, data, function (result) {
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.error));
        }
      });
    });
  }

  function sanitizeParam(val) {
    var hex = val.slice(2);
    return hex.length % 2 ? '0' + hex : hex;
  }

  function trezorSignTransaction(path, txData) {
    return new _promise2.default(function (resolve, reject) {
      _trezorConnect2.default.ethereumSignTx(path, sanitizeParam(txData.nonce), sanitizeParam(txData.gasPrice), sanitizeParam(txData.gas), txData.to.slice(2), txData.value ? sanitizeParam(txData.value) : '', txData.data ? sanitizeParam(txData.data) : '', parseInt(networkId, 10), function (result) {
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.error));
        }
      });
    });
  }

  if (options.promisify) {
    return new _hookedWallet2.default({
      getAccounts: _getAccounts,
      signPersonalMessage: _signPersonalMessage,
      signTransaction: _signTransaction
    });
  }

  var subprovider = new _hookedWallet2.default({
    getAccounts: function getAccounts(callback) {
      _getAccounts().then(function (res) {
        return callback(null, (0, _values2.default)(res));
      }).catch(function (err) {
        return callback(err, null);
      });
    },
    signPersonalMessage: function signPersonalMessage(txData, callback) {
      _signPersonalMessage(txData).then(function (res) {
        return callback(null, res);
      }).catch(function (err) {
        return callback(err, null);
      });
    },
    signTransaction: function signTransaction(txData, callback) {
      _signTransaction(txData).then(function (res) {
        return callback(null, res);
      }).catch(function (err) {
        return callback(err, null);
      });
    }
  });

  return subprovider;
}