import {ITransport} from "./Transport";

export class Http implements ITransport {

    public publish(): void {
        console.log(`Http request`);
    }
}
