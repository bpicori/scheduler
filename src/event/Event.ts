import { v4 } from 'uuid';
import { Queue } from '../store/Queue';
import { ITransport } from '../transport/Transport';
import { TransportFactory } from '../transport/TransportFactory';

export enum StatusEvent {
  PENDING = 'PENDING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export class Event implements IEvent {
  public static serialize(event: IEvent): any {
    const transportConfig = event.transport.getConfigs();
    const transportType = event.transport.type;
    return { ...event, transportConfig, transportType };
  }

  public static deserialize(event: any): IEvent {
    const transport = TransportFactory.getTransport(event.transportType, event.transportConfig);
    return new Event(event.name, event.timestamp, event.repeat, event.interval, transport);
  }

  public eventId: string;
  public timestamp: number;
  public repeat: boolean;
  public interval: number;
  public transport: ITransport;
  public name: string;
  public log: Queue<any>;

  constructor(name: string, timestamp: number, repeat: boolean, interval: number, transport: ITransport) {
    this.eventId = v4();
    this.name = name;
    this.timestamp = timestamp;
    this.repeat = repeat;
    this.interval = interval;
    this.transport = transport;
    this.log = new Queue(10);
  }
}

export interface IEvent {
  eventId: string ;
  timestamp: number;
  name: string;
  repeat: boolean;
  interval: number;
  transport: ITransport;
  log: Queue<any>;
}
