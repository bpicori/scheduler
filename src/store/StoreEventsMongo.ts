import { EventEmitter } from 'events';
import { Db, MongoClient } from 'mongodb';
import { Event, IEvent } from '../event/Event';
import { IStore } from './IStore';
import { Queue } from './Queue';

export class StoreEventsMongo extends EventEmitter implements IStore {
  private readonly client: MongoClient;
  private readonly dbName: string;
  private db: Db | null;
  private commandQueue: Queue<any>;
  private firstConnection: boolean;
  constructor(configs: IConfigs) {
    super();
    this.client = new MongoClient(configs.mongoUrl, { useNewUrlParser: true, poolSize: 10, reconnectTries: Number.MAX_VALUE, reconnectInterval: 5000 });
    this.dbName = configs.dbName;
    this.db = null;
    this.on('addEvent', this.addEvent);
    this.on('updateEvent', this.updateEvent);
    this.on('deleteEvent', this.deleteEvent);
    this.commandQueue = new Queue(Number.MAX_VALUE);
    this.firstConnection = true;
  }

  /**
   * Find all events
   */
  public async getAllEvents(): Promise<any> {
    if (this.db && this.client.isConnected()) {
      return this.db.collection('events').find({}).toArray();
    }
    return [];

  }

  /**
   * Add Event
   * @param event
   */
  public async addEvent(event: IEvent): Promise<any> {
    if (this.db && this.client.isConnected()) {
      await this.db.collection('events').insertOne(Event.serialize(event));
    } else {
      this.commandQueue.enqueue({ event, command: 'addEvent' });
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
      this.commandQueue.enqueue({ event, command: 'deleteEvent' });
    }
  }

  /**
   * Update Event
   * @param event
   */
  public async updateEvent(event: IEvent): Promise<any> {
    if (this.db && this.client.isConnected()) {
      await this.db.collection('events').findOneAndUpdate({ eventId: event.eventId },  { $set: Event.serialize(event) });
    } else {
      this.commandQueue.enqueue({ event, command: 'updateEvent' });
    }
  }

  public command(command: string, event: IEvent) {
    if (command === 'addEvent') {
      return this.addEvent(event);
    }  if (command === 'updateEvent') {
      return this.updateEvent(event);
    }  if (command === 'deleteEvent') {
      return this.deleteEvent(event);
    }
  }

  public async processQueue() {
    while (!this.commandQueue.isEmpty()) {
      const { command, event } = this.commandQueue.poll();
      await this.command(command, event);
    }
  }

  public async connect(): Promise<Db|null> {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.db.on('reconnect', this.onReconnect.bind(this));
      this.db.on('close', () => {
        console.warn('Mongodb Disconnected');
      });
      if (this.firstConnection) {
        this.firstConnection = false;
        console.log('Mongodb Connected');
        return this.db;
      }
      await this.processQueue();
      this.emit('syncEventManager', false);
      return this.db;
    } catch (err) {
      this.firstConnection = false;
      console.warn('Cant connect to MongoDb');
      setTimeout(this.connect.bind(this), 5000);
      return null;
    }
  }

  private async onReconnect() {
    await this.processQueue();
    this.emit('syncEventManager', false);
    console.log('Mongodb Reconnected');
  }

}
interface IConfigs {
  mongoUrl: string;
  dbName: string;
}
