import { ITransport } from "./Transport";
// TODO
export class Amqp implements ITransport {
  public publish(): void {
    console.log("amqp publish");
  }
}
