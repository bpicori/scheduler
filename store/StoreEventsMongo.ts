import { EventEmitter } from 'events';
import {Db, MongoClient} from 'mongodb';
import { Event, IEvent } from '../Event';
import {IStore} from './IStore';
import {Queue} from './Queue';

export class StoreEventsMongo extends EventEmitter implements IStore {
  private readonly client: MongoClient;
  private readonly dbName: string;
  private db: Db | null;
  private commandQueue: Queue;
  constructor(configs: IConfigs) {
    super();
    this.client = new MongoClient(configs.mongoUrl, { useNewUrlParser: true });
    this.dbName = configs.dbName;
    this.db = null;
    this.on('addEvent', this.addEvent);
    this.on('updateEvent', this.updateEvent);
    this.on('deleteEvent', this.deleteEvent);
    this.commandQueue = new Queue();
  }

  /**
   * Find all events
   */
  public async getAllEvents(): Promise<any> {
    if (this.db) {
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
    this.commandQueue.push({ command: 'addEvent', event });
    if (this.db) {
      await this.db.collection('events').insertOne(Event.serialize(event));
    } else {
    }
  }

  /**
   * Update Event
   * @param event
   */
  public async deleteEvent(event: IEvent): Promise<any> {
    if (this.db) {
      await this.db.collection('events').deleteOne({ eventId: event.eventId });
    } else {
      this.commandQueue.push({ command: 'deleteEvent', event });
    }
  }

  /**
   * Delete Event
   * @param event
   */
  public async updateEvent(event: IEvent): Promise<any> {
    if (this.db) {
      await this.db.collection('events').findOneAndUpdate({eventId: event.eventId},  {$set: Event.serialize(event)});
    } else {
      this.commandQueue.push({ command: 'updateEvent', event });
    }
  }

  public async connect(): Promise<Db> {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      return this.db;
    } catch (error) {
      console.log(`Cant't connect with mongodb. Error: ${error.message}`);
      await this._delay(5000);
      return this.connect();
    }
  }

  private _delay<T>(millis: number, value?: T): Promise<T> {
    return new Promise((resolve) => setTimeout(resolve(value), 100));
  }
}
// TODO
interface IConfigs {
  mongoUrl: string;
  dbName: string;
}
