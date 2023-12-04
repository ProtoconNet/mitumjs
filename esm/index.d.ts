import { Generator, IP } from "./types";
import { Block, Node } from "./node";
import { Account, Currency, Contract, NFT, DAO, KYC, STO, TimeStamp, Credential, Token, Point, Operation, Signer } from "./operation";
export declare class Mitum extends Generator {
    private _node;
    private _account;
    private _currency;
    private _contract;
    private _block;
    private _operation;
    private _signer;
    private _nft;
    private _credential;
    private _timestamp;
    private _sto;
    private _kyc;
    private _dao;
    private _token;
    private _point;
    constructor(api?: string);
    private refresh;
    get node(): Node;
    get account(): Account;
    get currency(): Currency;
    get block(): Block;
    get operation(): Operation;
    get signer(): Signer;
    get contract(): Contract;
    get nft(): NFT;
    get credential(): Credential;
    get timestamp(): TimeStamp;
    get sto(): STO;
    get kyc(): KYC;
    get dao(): DAO;
    get token(): Token;
    get point(): Point;
    /**
     * @deprecated use setAPI(api?: string | IP)
     */
    setNode(api?: string): void;
    setAPI(api?: string | IP): void;
    /**
     * @deprecated use .api (get)
     */
    getNode(): string;
    getAPI(): string;
    getChain(): string;
    setChain(networkID: string): void;
}
export default Mitum;
