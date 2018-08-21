'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _ethereumjsUtil = require('ethereumjs-util');

var _ethereumjsUtil2 = _interopRequireDefault(_ethereumjsUtil);

var _hdkey = require('hdkey');

var _hdkey2 = _interopRequireDefault(_hdkey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
var AddressGenerator = function AddressGenerator(data) {
  var _this = this;

  (0, _classCallCheck3.default)(this, AddressGenerator);

  this.getAddressString = function (index) {
    var derivedKey = _this.hdk.derive('m/' + index);
    var address = _ethereumjsUtil2.default.publicToAddress(derivedKey.publicKey, true);
    var addressString = '0x' + address.toString('hex');
    return addressString;
  };

  this.hdk = new _hdkey2.default();
  this.hdk.publicKey = new Buffer(data.publicKey, 'hex');
  this.hdk.chainCode = new Buffer(data.chainCode, 'hex');
};

exports.default = AddressGenerator;