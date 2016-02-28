import moment from "moment"

// ignore moment
declare module "moment" {
  declare function exports(): moment;
}

//
type FetchResponse = {
  json: () => any
}

declare module "node-fetch" {
  declare function exports(path: ?string, options: Object): Promise<FetchResponse>;
}

//
declare var require: {(s: string): any, main: Object}

