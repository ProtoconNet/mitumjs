import { IP } from "./string"

export abstract class Generator {
    protected _networkID: string
    protected _api: IP | undefined
    protected _delegateIP: IP | undefined

    protected constructor(networkID: string, api?: string | IP, delegateIP?: string | IP,) {
        this._networkID = networkID
        this.setAPI(api);
        this.setDelegate(delegateIP);
    }

    protected setNetworkID(networkID: string) {
        this._networkID = networkID
    }

    protected setAPI(api?: string | IP) {
        if (typeof api === "string") {
            this._api = IP.from(api.endsWith('/') ? api.slice(0, -1) : api);
        } else if (api instanceof IP) {
            this._api = api;
        } else {
            this._api = undefined;
        }
    }

    protected setDelegate(delegateIP?: string | IP) { 
        if (typeof delegateIP === "string") {
            this._delegateIP = IP.from(delegateIP.endsWith('/') ? delegateIP.slice(0, -1) : delegateIP);
        } else if (delegateIP instanceof IP) {
            this._delegateIP = delegateIP;
        } else {
            this._delegateIP = undefined;
        }
    }

    protected get networkID() {
        return this._networkID
    }

    protected get api() {
        return this._api ? this._api.toString() : undefined
    }

    protected get delegateIP() {
        return this._delegateIP ? this._delegateIP.toString() : undefined
    }
}