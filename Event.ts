import {v4} from 'uuid';
import {ITransport} from './transport/Transport';

export enum StatusEvent {
  PENDING,
  DONE,
  ERROR,
}

export interface ILog {
  message: string;
  status: StatusEvent;
  error?: Error;
}

export class Event implements IEvent {
  public id: string;
  public timestamp: number;
  public repeat?: boolean;
  public interval?: number;
  public transport: ITransport;
  public name: string;
  public log?: ILog;

  constructor(config: IEvent) {
    this.id = v4();
    this.name = config.name;
    this.timestamp = config.timestamp;
    this.repeat = config.repeat;
    this.interval = config.interval;
    this.transport = config.transport;
    this.log = {
      message: 'Not fired yet',
      status: StatusEvent.PENDING,
    };
  }
}

export interface IEvent {
  timestamp: number;
  name: string;
  repeat?: boolean;
  interval?: number;
  transport: ITransport;
  [key: string]: any;
  log?: ILog;
}
