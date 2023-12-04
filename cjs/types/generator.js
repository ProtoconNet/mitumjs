"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const string_1 = require("./string");
class Generator {
    constructor(networkID, api) {
        this._networkID = networkID;
        this._api = api ? string_1.IP.from(api) : undefined;
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
        this._api = api ? string_1.IP.from(api) : undefined;
    }
    get networkID() {
        return this._networkID;
    }
    get api() {
        return this._api ? this._api.toString() : "";
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map