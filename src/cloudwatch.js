//@flow
import moment from "moment"

const DATE_FORMAT = "YYYY-MM-DDThh:mm:ss.000[Z]"

type Unit = string

type Datapoint = {
  Timestamp: string,
  Average: number,
  Unit: Unit,
}

type Statistics = {
}

function to_Unit(units: string): Unit {
  switch (units) {
  case "": return "Count";
  case "%": return "Percent";
  default: return units;
  }
}

const CloudWatch = {

  to_Datapoint: function(units: string): (e: ZabbixHistoryItem) => Datapoint {
    return (e) => ({
      Timestamp: moment(eval(e.clock)*1000).format(DATE_FORMAT),
      Average: eval(e.value),
      Unit: to_Unit(units),
    })
  },

  to_Statistics: function(time_from: moment, name: string, label: string): (e: Array<Datapoint>) => Statistics {
    return (datapoints) => ({
      Namespace: "AWS/EC2",
      InstanceId: name,
      StartTime: time_from,
      EndTime: moment().format(DATE_FORMAT),
      Period: moment.duration(1, "minute").asSeconds(),
      Label: label,
      ResponseMetadata: {RequestId: "whatever"},
      Datapoints: datapoints,
    })
  },
}

export default CloudWatch
