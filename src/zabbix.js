//@flow
import fetch  from "node-fetch"
import moment from "moment"

const ZABBIX_API_ENDPOINT: ?string = (process.env.ZABBIX_API_ENDPOINT: ?string)

type APIToken = string

type ZabbixItem = {
  itemid: string,
  name: string,
  units: string,
}

type ZabbixHost = {
  hostid: string,
  name: string,
}

type ZabbixAPIResponse = {
  result: Array<ZabbixHistoryItem> & Array<ZabbixItem> & ZabbixHost & APIToken
}

function zabbix_api_send(body: Object): Promise<ZabbixAPIResponse> {
  return fetch(ZABBIX_API_ENDPOINT, {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(body),
    })
    .then(res => res.json())
}

function zabbix_api_body(args: Object) {
  return {
    jsonrpc: "2.0",
    //"auth: "038e1d7b1735c6a5436ee9eae095879e",
    id: 1,
    ...args,
  }
}

function zabbix_login(user: ?string, password: ?string): Promise<APIToken> {
  const req = zabbix_api_body({
    method: "user.login",
    params: {
      user:     user     || process.env.ZABBIX_USER,
      password: password || process.env.ZABBIX_PASSWORD,
    },
  })
  return zabbix_api_send(req)
    .then(body => body.result)
    //.then(result => {console.log(result); return result})
}

// https://www.zabbix.com/documentation/2.0/manual/appendix/api
class ZabbixAPI {

  _token: string;

  constructor(token: string) {
    this._token = token
  }

  host_get(filter_host: string): Promise<ZabbixAPIResponse> {
    const req = zabbix_api_body({
      method: "host.get",
      params: {
        output: "extend",
        selectInterfaces: "extend",
        monitored_hosts: "True",
        filter: {
          host: [filter_host],
        }
      },
    })
    return zabbix_api_send({...req, auth: this._token})
  }

  item_get(hostid: string, key: string): Promise<ZabbixAPIResponse> {
    const req = zabbix_api_body({
      method: "item.get",
      params: {
        output: "extend",
        hostids: hostid,
        search: {
          key_: key,
        }
      },
    })
    return zabbix_api_send({...req, auth: this._token})
  }
 
  history_get(hostid: string, itemid: string, time_from: moment): Promise<ZabbixAPIResponse> {
    const req = zabbix_api_body({
      method: "history.get",
      params: {
        output: "extend",
        history: 3,  // 0: float,  1: string, 2: log, 3: integer,  4: text
        hostid,
        itemids: [itemid],
        time_from,
        //limit: 5,
      },
    })
    return zabbix_api_send({...req, auth: this._token})
  }
}

const Zabbix = {
  login: function(user: ?string = undefined, password: ?string = undefined): Promise<ZabbixAPI> {
    const token = process.env.ZABBIX_API_TOKEN
    return (token ? Promise.resolve(token) : zabbix_login(user, password))
      .then(token => new ZabbixAPI(token))
  },
}

export default Zabbix

