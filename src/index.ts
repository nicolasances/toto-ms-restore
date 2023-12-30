import { TotoAPIController } from "toto-api-controller";
import { ControllerConfig } from "./Config";
import { Restore } from "./dlg/Restore";

const api = new TotoAPIController("toto-ms-restore", new ControllerConfig())

api.path('POST', '/restore', new Restore())

api.init().then(() => {
    api.listen()
});