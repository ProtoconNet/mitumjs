"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mitum = void 0;
const types_1 = require("./types");
const node_1 = require("./node");
const operation_1 = require("./operation");
class Mitum extends types_1.Generator {
    constructor(api) {
        super(node_1.NetworkID.get(), api);
        this._node = new node_1.Node(this.api);
        this._account = new operation_1.Account(this.networkID, this.api);
        this._currency = new operation_1.Currency(this.networkID, this.api);
        this._block = new node_1.Block(this.api);
        this._operation = new operation_1.Operation(this.networkID, this.api);
        this._signer = new operation_1.Signer(this.networkID, this.api);
        this._contract = new operation_1.Contract(this.networkID, this.api);
        this._nft = new operation_1.NFT(this.networkID, this.api);
        this._credential = new operation_1.Credential(this.networkID, this.api);
        this._timestamp = new operation_1.TimeStamp(this.networkID, this.api);
        this._sto = new operation_1.STO(this.networkID, this.api);
        this._kyc = new operation_1.KYC(this.networkID, this.api);
        this._dao = new operation_1.DAO(this.networkID, this.api);
        this._token = new operation_1.Token(this.networkID, this.api);
        this._point = new operation_1.Point(this.networkID, this.api);
    }
    refresh() {
        this._node = new node_1.Node(this.api);
        this._account = new operation_1.Account(this.networkID, this.api);
        this._currency = new operation_1.Currency(this.networkID, this.api);
        this._block = new node_1.Block(this.api);
        this._operation = new operation_1.Operation(this.networkID, this.api);
        this._contract = new operation_1.Contract(this.networkID, this.api);
        this._nft = new operation_1.NFT(this.networkID, this.api);
        this._credential = new operation_1.Credential(this.networkID, this.api);
        this._timestamp = new operation_1.TimeStamp(this.networkID, this.api);
        this._sto = new operation_1.STO(this.networkID, this.api);
        this._kyc = new operation_1.KYC(this.networkID, this.api);
        this._dao = new operation_1.DAO(this.networkID, this.api);
        this._token = new operation_1.Token(this.networkID, this.api);
        this._point = new operation_1.Point(this.networkID, this.api);
    }
    get node() {
        return this._node;
    }
    get account() {
        return this._account;
    }
    get currency() {
        return this._currency;
    }
    get block() {
        return this._block;
    }
    get operation() {
        return this._operation;
    }
    get signer() {
        return this._signer;
    }
    get contract() {
        return this._contract;
    }
    get nft() {
        return this._nft;
    }
    get credential() {
        return this._credential;
    }
    get timestamp() {
        return this._timestamp;
    }
    get sto() {
        return this._sto;
    }
    get kyc() {
        return this._kyc;
    }
    get dao() {
        return this._dao;
    }
    get token() {
        return this._token;
    }
    get point() {
        return this._point;
    }
    /**
     * @deprecated use setAPI(api?: string | IP)
     */
    setNode(api) {
        this.setAPI(api);
    }
    setAPI(api) {
        super.setAPI(api);
        this.refresh();
    }
    /**
     * @deprecated use .api (get)
     */
    getNode() {
        return this.api.toString();
    }
    getAPI() {
        return this.api.toString();
    }
    getChain() {
        return this.networkID;
    }
    setChain(networkID) {
        super.setNetworkID(networkID);
        this.refresh();
    }
}
exports.Mitum = Mitum;
exports.default = Mitum;
//# sourceMappingURL=index.js.map