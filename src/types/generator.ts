import { IP } from "./string"

export abstract class Generator {
    protected _networkID: string
    protected _api: IP | undefined
    protected _delegateIP: IP | undefined

    protected constructor(networkID: string, api?: string | IP, delegateIP?: string | IP,) {
        this._networkID = networkID
        this._api = api ? IP.from(api) : undefined
        this._delegateIP = delegateIP ? IP.from(delegateIP) : undefined
    }

    protected setNetworkID(networkID: string) {
        this._networkID = networkID
    }

    protected setAPI(api?: string | IP) {
        this._api = api ? IP.from(api) : undefined
    }

    protected setDelegate(delegateIP?: string | IP) { 
        this._delegateIP = delegateIP ? IP.from(delegateIP) : undefined
    }

    protected get networkID() {
        return this._networkID
    }

    protected get api() {
        return this._api ? this._api.toString() : ""
    }

    protected get delegateIP() {
        return this._delegateIP ? this._delegateIP.toString() : ""
    }
}