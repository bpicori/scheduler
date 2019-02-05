import axios, {AxiosRequestConfig} from 'axios';
import {ITransport, TransportType} from './Transport';

export class Http implements ITransport {
  public type: TransportType.HTTP;
  private readonly requestParams: AxiosRequestConfig;

  constructor(config: AxiosRequestConfig) {
    this.type = TransportType.HTTP;
    this.requestParams = config;
  }

  public async publish(): Promise<any> {
    try {
      const res = await axios(this.requestParams);
    } catch (e) {
      return;
    }
  }

  public getConfigs(): AxiosRequestConfig {
    return { ...this.requestParams };
  }
}
