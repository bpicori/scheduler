import {ITransport} from "./Transport";
// TODO
export class Http implements ITransport {

    public publish(): void {
        console.log(`Http request`);
    }
}
