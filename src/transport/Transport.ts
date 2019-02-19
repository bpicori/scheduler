import { AxiosRequestConfig } from 'axios';
import { IAmqpConfigs } from './Amqp';

export enum TransportType {
  HTTP = 'http',
  AMQP = 'amqp',
}

export interface ITransportConfig extends AxiosRequestConfig, IAmqpConfigs {}

export interface ITransport {
  type: TransportType;
  fire(): Promise<any>;
  getConfigs(): AxiosRequestConfig | IAmqpConfigs;
}
