import { EventEmitter } from "events";
import {Event, IEvent} from "../Event";

export class StoreManager extends EventEmitter {
    constructor(configs: IConfigs) {
        super();

    }

  public async getAllEvents(): Promise<IEvent[]> {
      return [];
  }
}
// TODO
interface IConfigs {
  filePath: string;
}
