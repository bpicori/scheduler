/**
 * Created by bpicori on 19-02-04
 */
import {AxiosRequestConfig} from 'axios';
import {Http} from './Http';
import {ITransport, TransportType} from './Transport';

export class TransportFactory {
  public static getTransport(type: string, config: AxiosRequestConfig): ITransport {
    if (type === TransportType.HTTP) {
      // return
      return new Http(config);
    }
    throw new Error(' Type not found');
  }
}
