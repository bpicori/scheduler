import * as Amqplib from 'amqplib';
import { ITransport, TransportType } from './Transport';

export class Amqp implements ITransport {
  public type: TransportType.AMQP;
  private readonly amqpConfigs: IAmqpConfigs;

  constructor(configs: IAmqpConfigs) {
    this.type = TransportType.AMQP;
    this.amqpConfigs = configs;
  }
  public async publish(): Promise<any> {
    const conn = await Amqplib.connect(this.amqpConfigs.rabbitUri);
    const channel = await conn.createChannel();
    const content = Buffer.from(JSON.stringify(this.amqpConfigs.payload));
    await channel.publish(this.amqpConfigs.exchange, this.amqpConfigs.routingKey, content);
    await conn.close();
  }

  public getConfigs(): IAmqpConfigs {
    return this.amqpConfigs;
  }
}

export interface  IAmqpConfigs {
  exchange: string;
  routingKey: string;
  payload: any;
  rabbitUri: string;
}
