/**
 * Created by bpicori on 19-02-18
 */
import { EventManager, Server, StoreEventsMongo } from '../src/main';

async function main() {
  const schedulerStore = new StoreEventsMongo({
    dbName: 'scheduler',
    mongoUrl: 'mongodb://localhost:27017',
  });
  const scheduler = new EventManager(schedulerStore);
  const server = new Server('0.0.0.0', 3000, scheduler);
  await server.start();
  await scheduler.start();
}

main().catch(err => console.log(err));
