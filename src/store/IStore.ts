import {IEvent} from '../event/Event';

/**
 * Created by bpicori on 19-02-04
 */
export interface IStore {
  connect(): void;
  getAllEvents(): Promise<IEvent[]>;
  addEvent(event: IEvent): void;
  updateEvent(event: IEvent): void;
  deleteEvent(event: IEvent): void;
}
