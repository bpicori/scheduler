import {ITransport} from "./Transport";

export class Amqp implements ITransport {
    public publish(): void {
        console.log("amqp publish");
    }
}
