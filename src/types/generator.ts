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

    setNetworkID(networkID: string) {
        this._networkID = networkID
    }

    setAPI(api?: string | IP) {
        this._api = api ? IP.from(api) : undefined
    }

    setDelegate(delegateIP?: string | IP) { 
        this._delegateIP = delegateIP ? IP.from(delegateIP) : undefined
    }

    get networkID() {
        return this._networkID
    }

    get api() {
        return this._api ? this._api.toString() : ""
    }

    get delegateIP() {
        return this._delegateIP ? this._delegateIP.toString() : ""
    }
}