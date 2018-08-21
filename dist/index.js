'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = function (maker) {
  var _this = this;

  console.log('Setting up Trezor support...');

  maker.service('accounts', true).addAccountType('trezor', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(settings) {
      var subprovider, address;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              subprovider = (0, _trezorSubprovider2.default)({
                // options: networkId, path, accountsLength, accountsOffset
                path: settings.path || defaultDerivationPath
              });
              _context.next = 3;
              return new _promise2.default(function (resolve) {
                return subprovider.getAccounts(function (addresses) {
                  return resolve(addresses[0]);
                });
              });

            case 3:
              address = _context.sent;
              return _context.abrupt('return', { subprovider: subprovider, address: address });

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};

var _trezorSubprovider = require('./hw-wallet/vendor/trezor-subprovider');

var _trezorSubprovider2 = _interopRequireDefault(_trezorSubprovider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultDerivationPath = "44'/60'/0'/0/0";