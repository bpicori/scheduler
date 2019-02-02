import { v4 } from "uuid";
import { ITransport } from "./transport/Transport";

export class Event implements IEvent {
  public id: string;
  public timestamp: number;
  public repeat?: boolean;
  public interval?: number;
  public transport: ITransport;

  constructor(config: IEvent) {
    this.id = v4();
    this.timestamp = config.timestamp;
    this.repeat = config.repeat;
    this.interval = config.interval;
    this.transport = config.transport;
  }
}

export interface IEvent {
  timestamp: number;
  repeat?: boolean;
  interval?: number;
  transport: ITransport;
  [key: string]: any;
}
