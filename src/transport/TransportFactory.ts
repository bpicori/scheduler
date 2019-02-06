/**
 * Created by bpicori on 19-02-04
 */
import { AxiosRequestConfig } from 'axios';
import { Amqp, IAmqpConfigs } from './Amqp';
import { Http } from './Http';
import { ITransport, ITransportConfig, TransportType } from './Transport';

export class TransportFactory {
  public static getTransport(type: string, config: IAmqpConfigs | AxiosRequestConfig): ITransport {
    if (type === TransportType.HTTP) {
      return new Http(config as AxiosRequestConfig);
    }  if (type === TransportType.AMQP) {
      return new Amqp(config as IAmqpConfigs);
    }
    throw new Error(' Type not found');
  }
}
