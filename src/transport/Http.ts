import axios, { AxiosRequestConfig } from 'axios';
import { ITransport, ITransportConfig, TransportType } from './Transport';

export class Http implements ITransport {
  public type: TransportType.HTTP;
  private readonly requestParams: AxiosRequestConfig;

  constructor(config: AxiosRequestConfig) {
    this.type = TransportType.HTTP;
    this.requestParams = config;
  }

  public async fire(): Promise<any> {
    try {
      const { data, status } = await axios(this.requestParams);
      return { data, status };
    } catch (e) {
      if (e.response) {
        return { message: e.message, data: e.response.data, status: e.response.status };
      }
      return { message: e.message, code: e.code };
    }
  }

  public getConfigs(): AxiosRequestConfig {
    return this.requestParams;
  }
}
