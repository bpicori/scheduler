/**
 * Created by bpicori on 19-02-05
 */
import * as Hapi from 'hapi';
import EventManager from '../event/EventManager';
import { EventController } from './EventController';

export class Server {
  private server: Hapi.Server;
  private readonly controller: EventController;

  constructor(host: string, port: number, scheduler: EventManager) {
    this.server = new Hapi.Server({
      host,
      port,
      routes: {
        cors: {
          additionalExposedHeaders: ['jwt'],
          additionalHeaders: ['jwt'],
          origin: ['*'],
        },
      },
    });
    this.controller = new EventController(scheduler);
  }

  public async start() {
    try {
      await this.routes();
      await this.server.start();
      console.log(`Server running at: ${this.server.info.uri}`);
    } catch (err) {
      console.log(`Hapi error: ${err.message}`);
    }
  }

  private routes() {
    // index
    this.server.route({
      handler: this.controller.index.bind(this.controller),
      method: 'GET',
      path: '/',
    });
    this.server.route({
      handler: this.controller.create.bind(this.controller),
      method: 'POST',
      path: '/',
    });
    this.server.route({
      handler: this.controller.update.bind(this.controller),
      method: 'PUT',
      path: '/',
    });
    this.server.route({
      handler: this.controller.delete.bind(this.controller),
      method: 'DELETE',
      path: '/',
    });
  }
}
