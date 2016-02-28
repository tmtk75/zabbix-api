"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _nodeFetch = require("node-fetch");

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ZABBIX_API_ENDPOINT = process.env.ZABBIX_API_ENDPOINT;

function zabbix_api_send(body) {
  return (0, _nodeFetch2.default)(ZABBIX_API_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  }).then(function (res) {
    return res.json();
  });
}

function zabbix_api_body(args) {
  return _extends({
    jsonrpc: "2.0",
    //"auth: "038e1d7b1735c6a5436ee9eae095879e",
    id: 1
  }, args);
}

function zabbix_login(user, password) {
  var req = zabbix_api_body({
    method: "user.login",
    params: {
      user: user || process.env.ZABBIX_USER,
      password: password || process.env.ZABBIX_PASSWORD
    }
  });
  return zabbix_api_send(req).then(function (body) {
    return body.result;
  });
  //.then(result => {console.log(result); return result})
}

// https://www.zabbix.com/documentation/2.0/manual/appendix/api

var ZabbixAPI = function () {
  function ZabbixAPI(token) {
    _classCallCheck(this, ZabbixAPI);

    this._token = token;
  }

  _createClass(ZabbixAPI, [{
    key: "host_get",
    value: function host_get(filter_host) {
      var req = zabbix_api_body({
        method: "host.get",
        params: {
          output: "extend",
          selectInterfaces: "extend",
          monitored_hosts: "True",
          filter: {
            host: [filter_host]
          }
        }
      });
      return zabbix_api_send(_extends({}, req, { auth: this._token }));
    }
  }, {
    key: "item_get",
    value: function item_get(hostid, key) {
      var req = zabbix_api_body({
        method: "item.get",
        params: {
          output: "extend",
          hostids: hostid,
          search: {
            key_: key
          }
        }
      });
      return zabbix_api_send(_extends({}, req, { auth: this._token }));
    }
  }, {
    key: "history_get",
    value: function history_get(hostid, itemid, time_from) {
      var req = zabbix_api_body({
        method: "history.get",
        params: {
          output: "extend",
          history: 3, // 0: float,  1: string, 2: log, 3: integer,  4: text
          hostid: hostid,
          itemids: [itemid],
          time_from: time_from
        }
      });
      //limit: 5,
      return zabbix_api_send(_extends({}, req, { auth: this._token }));
    }
  }]);

  return ZabbixAPI;
}();

var Zabbix = {
  login: function login() {
    var user = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
    var password = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

    var token = process.env.ZABBIX_API_TOKEN;
    return (token ? Promise.resolve(token) : zabbix_login(user, password)).then(function (token) {
      return new ZabbixAPI(token);
    });
  }
};

exports.default = Zabbix;