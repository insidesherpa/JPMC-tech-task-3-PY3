import { ServerRespond } from './DataStreamer';

export interface Row {
  // Updated row data to be passed into Graph
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  // Modify function to work with new schema
  static generateRow(serverRespond: ServerRespond[]): Row {   // Remove array as only using one row
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;  // Calculate ratio
    // Adjusted upper and lower bounds
    const upperBound = 1 + 0.04;
    const lowerBound = 1 - 0.04;
    // Return data to Graph
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,  // Alert when outside of specified range
    };
  }
}
