/**
 * Created by bpicori on 19-02-05
 */

import * as Hapi from 'hapi';
import { Event } from '../event/Event';
import { EventManager } from '../event/EventManager';
import Logger from '../Logger';

export class EventController {
  private scheduler: EventManager;
  constructor(scheduler: EventManager) {
    this.scheduler = scheduler;
  }

  /**
   * Get Events
   * @param request
   * @param h
   */
  public index(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    Logger.info('Server get Events');
    return h.response(this.scheduler.getEvents()).code(200);
  }

  /**
   * Create Event
   * @param request
   * @param h
   */
  public create(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    this.scheduler.addEvent(Event.deserialize(request.payload));
    Logger.info('Server Create Event', request.payload);
    return true;
  }

  /**
   * Update Event
   * @param request
   * @param h
   */
  public update(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    this.scheduler.updateEvent(Event.deserialize(request.payload));
    Logger.info('Server Update Event', request.payload);
    return true;
  }

  /**
   * Delete Event
   * @param request
   * @param h
   */
  public delete(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const event = this.scheduler.getEventById(request.params.id);
    this.scheduler.deleteEvent(event);
    Logger.info('Server Delete Event', event.name);
    return true;
  }
}
