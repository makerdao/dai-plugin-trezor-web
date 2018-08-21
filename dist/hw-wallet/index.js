'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHardwareWallet = exports.useTrezor = exports.LEDGER = exports.TREZOR = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var useTrezor = exports.useTrezor = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(web3, deviceOptions, rpcUrl) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', useHardwareWallet(web3, TREZOR, deviceOptions, rpcUrl));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function useTrezor(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// deviceOptions: networkId, path, accountsLength, accountsOffset


var useHardwareWallet = exports.useHardwareWallet = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(web3, device, deviceOptions, rpcUrl) {
    var wallet;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            web3.stop();
            web3.setProvider(new Web3ProviderEngine());
            web3.currentProvider.name = device;
            wallet = (0, _trezorSubprovider2.default)(deviceOptions);

            web3.currentProvider.addProvider(wallet);
            // FIXME can we get the rpcUrl value from the existing settings?
            web3.currentProvider.addProvider(new RpcSource({ rpcUrl: rpcUrl }));
            web3.currentProvider.start();
            web3.useLogs = false;

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function useHardwareWallet(_x4, _x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
}();

var _es = require('web3-provider-engine/dist/es5');

var Web3ProviderEngine = _interopRequireWildcard(_es);

var _rpc = require('web3-provider-engine/dist/es5/subproviders/rpc');

var RpcSource = _interopRequireWildcard(_rpc);

var _trezorSubprovider = require('./vendor/trezor-subprovider');

var _trezorSubprovider2 = _interopRequireDefault(_trezorSubprovider);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TREZOR = exports.TREZOR = 'TREZOR';
var LEDGER = exports.LEDGER = 'LEDGER';