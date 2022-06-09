// import { DataCache } from "../services/redis.service";
import { ILoggedUser } from "./authorization/authorization.controller";

interface IConfig {
    cache: any
}
export class ControllerBase {

    private _name: string;
    protected user: ILoggedUser;
    protected dbKey: string;
    protected Cache;

    constructor(name: string, dbKey: string, user: ILoggedUser, config?: IConfig) {
        this._name = name;
        this.user = user
        this.dbKey = dbKey;
        this.Cache = config?.cache;//|| DataCache;
    }

    getName(): string {
        return this._name;
    }

}