import {AxiosRequestConfig} from 'axios';

export enum TransportType {
  HTTP = 'http',
  AMQP = 'amqp',
}

export interface ITransport {
  type: TransportType;
  publish(): void;
  getConfigs(): AxiosRequestConfig;
}
