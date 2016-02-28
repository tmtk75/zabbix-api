"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloudwatch = exports.zabbix = undefined;

var _zabbix = require("./zabbix.js");

var _zabbix2 = _interopRequireDefault(_zabbix);

var _cloudwatch = require("./cloudwatch.js");

var _cloudwatch2 = _interopRequireDefault(_cloudwatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.zabbix = _zabbix2.default;
exports.cloudwatch = _cloudwatch2.default;