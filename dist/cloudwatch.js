"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DATE_FORMAT = "YYYY-MM-DDThh:mm:ss.000[Z]";

function to_Unit(units) {
  switch (units) {
    case "":
      return "Count";
    case "%":
      return "Percent";
    default:
      return units;
  }
}

var CloudWatch = {

  to_Datapoint: function to_Datapoint(units) {
    return function (e) {
      return {
        Timestamp: (0, _moment2.default)(eval(e.clock) * 1000).format(DATE_FORMAT),
        Average: eval(e.value),
        Unit: to_Unit(units)
      };
    };
  },

  to_Statistics: function to_Statistics(time_from, name, label) {
    return function (datapoints) {
      return {
        Namespace: "AWS/EC2",
        InstanceId: name,
        StartTime: time_from,
        EndTime: (0, _moment2.default)().format(DATE_FORMAT),
        Period: _moment2.default.duration(1, "minute").asSeconds(),
        Label: label,
        ResponseMetadata: { RequestId: "whatever" },
        Datapoints: datapoints
      };
    };
  }
};

exports.default = CloudWatch;