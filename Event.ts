import {v4} from 'uuid';
import {Http} from './transport/Http';
import {ITransport, TransportType} from './transport/Transport';
import {TransportFactory} from './transport/TransportFactory';

export enum StatusEvent {
  PENDING,
  DONE,
  ERROR,
}

export class Event implements IEvent {

  public static serialize(event: IEvent): any {
    const transportConfig = event.transport.getConfigs();
    return  { ...event, transport: transportConfig };
  }

  public static deserialize(event: any): IEvent {
    const transport = new Http(event.transport);
    return new Event(event.name, event.timestamp, event.repeat, event.interval, transport);
  }

  public eventId: string;
  public timestamp: number;
  public repeat: boolean;
  public interval?: number;
  public transport: ITransport;
  public name: string;
  public status: StatusEvent;

  constructor(name: string, timestamp: number, repeat: boolean, interval: number, transport: ITransport) {
    this.eventId = v4();
    this.name = name;
    this.timestamp = timestamp;
    this.repeat = repeat;
    this.interval = interval;
    this.transport = transport;
    this.status = StatusEvent.PENDING;
  }
}

export interface IEvent {
  eventId: string ;
  timestamp: number;
  name: string;
  repeat: boolean;
  interval?: number;
  transport: ITransport;
  status: StatusEvent;
  [key: string]: any;
  // serialize(event: IEvent): any;
}
