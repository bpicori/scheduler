import { EventEmitter } from 'events';
import {Db, MongoClient} from 'mongodb';
import { Event, IEvent } from '../event/Event';
import {IStore} from './IStore';
import {Queue} from './Queue';

export class StoreEventsMongo extends EventEmitter implements IStore {
  private readonly client: MongoClient;
  private readonly dbName: string;
  private db: Db | null;
  private commandQueue: Queue;
  constructor(configs: IConfigs) {
    super();
    this.client = new MongoClient(configs.mongoUrl, { useNewUrlParser: true, poolSize: 10, reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000 });
    this.dbName = configs.dbName;
    this.db = null;
    this.on('addEvent', this.addEvent);
    this.on('updateEvent', this.updateEvent);
    this.on('deleteEvent', this.deleteEvent);
    this.commandQueue = new Queue(Number.MAX_VALUE);
  }

  /**
   * Find all events
   */
  public async getAllEvents(): Promise<any> {
    if (this.db && this.client.isConnected()) {
      return this.db.collection('events').find({}).toArray();
    } else {
      return [];
    }
  }

  /**
   * Add Event
   * @param event
   */
  public async addEvent(event: IEvent): Promise<any> {
    if (this.db && this.client.isConnected()) {
      await this.db.collection('events').insertOne(Event.serialize(event));
    } else {
      this.commandQueue.enqueue({ command: 'addEvent', event });
    }
  }

  /**
   * Update Event
   * @param event
   */
  public async deleteEvent(event: IEvent): Promise<any> {
    if (this.db && this.client.isConnected()) {
      await this.db.collection('events').deleteOne({ eventId: event.eventId });
    } else {
      this.commandQueue.enqueue({ command: 'deleteEvent', event });
    }
  }

  /**
   * Update Event
   * @param event
   */
  public async updateEvent(event: IEvent): Promise<any> {
    if (this.db && this.client.isConnected()) {
      await this.db.collection('events').findOneAndUpdate({eventId: event.eventId},  {$set: Event.serialize(event)});
    } else {
      this.commandQueue.enqueue({ command: 'updateEvent', event });
    }
  }

  public async connect(): Promise<Db|null> {

    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.db.on('reconnect', () => {
        console.log('Mongodb Connected');
      });
      this.db.on('close', () => {
        console.warn('Mongodb Disconnected');
      });
      return this.db;
    } catch (err) {
      await this._delay(1000);
      return this.connect();
    }
  }

  private _delay<T>(millis: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve(), millis));
  }
}
// TODO
interface IConfigs {
  mongoUrl: string;
  dbName: string;
}
