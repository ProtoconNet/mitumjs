import { IP } from "./string";
export class Generator {
    _networkID;
    _api;
    constructor(networkID, api) {
        this._networkID = networkID;
        this._api = api ? IP.from(api) : undefined;
    }
    /**
     * @deprecated use setNetworkID(networkID: string)
     */
    setChainID(networkID) {
        this.setNetworkID(networkID);
    }
    setNetworkID(networkID) {
        this._networkID = networkID;
    }
    /**
     * @deprecated use setAPI(api?: string | IP)
     */
    setNode(api) {
        this.setAPI(api);
    }
    setAPI(api) {
        this._api = api ? IP.from(api) : undefined;
    }
    get networkID() {
        return this._networkID;
    }
    get api() {
        return this._api ? this._api.toString() : "";
    }
}
//# sourceMappingURL=generator.js.map