import { EventEmitter } from 'events';
import {Db, MongoClient} from 'mongodb';
import { Event, IEvent } from '../Event';
import {IStore} from './IStore';

export class StoreEventsMongo extends EventEmitter implements IStore {
  private readonly client: MongoClient;
  private readonly dbName: string;
  private db: Db | null;
  constructor(configs: IConfigs) {
    super();
    this.client = new MongoClient(configs.mongoUrl, { useNewUrlParser: true });
    this.dbName = configs.dbName;
    this.db = null;
    this.on('addEvent', this.addEvent);
    this.on('updateEvent', this.updateEvent);
    this.on('deleteEvent', this.deleteEvent);
  }

  /**
   * Find all events
   */
  public async getAllEvents(): Promise<any> {
    if (this.db) {
      return this.db.collection('events').find({}).toArray();
    }
  }

  /**
   * Add Event
   * @param event
   */
  public async addEvent(event: IEvent): Promise<any> {
    if (this.db) {
      await this.db.collection('events').findOneAndUpdate({eventId: event.eventId},  {$set: Event.serialize(event)}, { upsert: true });
    }
  }
  // TODO
  public deleteEvent(event: IEvent): void {
  }
  // TODO
  public updateEvent(event: IEvent): void {
  }

  public async connect(): Promise<Db> {
    await this.client.connect();
    console.log('Connected to MongoDb');
    this.db = this.client.db(this.dbName);
    return this.db;
  }
}
// TODO
interface IConfigs {
  mongoUrl: string;
  dbName: string;
}
