import { Generator, IP } from "./types"

import { Block, Node, NetworkID } from "./node"
import { 
    Account, Currency, Contract, 
    NFT,
    DAO, KYC, STO,
    TimeStamp, Credential,
    Token, Point,
    Operation,
} from "./operation"

export class Mitum extends Generator {
    private _node: Node

    private _account: Account
    private _currency: Currency
    private _contract: Contract
    private _block: Block
    private _operation: Operation

    private _nft: NFT
    private _credential: Credential
    private _timestamp: TimeStamp
    private _sto: STO
    private _kyc: KYC
    private _dao: DAO
    private _token: Token
    private _point: Point

    public constructor(api?: string) {
        super(NetworkID.get(), api)
        this._node = new Node(this.api)

        this._account = new Account(this.networkID,this. api)
        this._currency = new Currency(this.networkID, this.api)
        this._block = new Block(this.api)
        this._operation = new Operation(this.networkID, this.api)

        this._contract = new Contract(this.networkID, this.api)
        this._nft = new NFT(this.networkID, this.api)
        this._credential = new Credential(this.networkID, this.api)
        this._timestamp = new TimeStamp(this.networkID, this.api)
        this._sto = new STO(this.networkID, this.api)
        this._kyc = new KYC(this.networkID, this.api)
        this._dao = new DAO(this.networkID, this.api)
        this._token = new Token(this.networkID, this.api)
        this._point = new Point(this.networkID, this.api)
    }

    private refresh() {
        this._node = new Node(this.api)

        this._account = new Account(this.networkID,this. api)
        this._currency = new Currency(this.networkID, this.api)
        this._block = new Block(this.api)
        this._operation = new Operation(this.networkID, this.api)

        this._contract = new Contract(this.networkID, this.api)
        this._nft = new NFT(this.networkID, this.api)
        this._credential = new Credential(this.networkID, this.api)
        this._timestamp = new TimeStamp(this.networkID, this.api)
        this._sto = new STO(this.networkID, this.api)
        this._kyc = new KYC(this.networkID, this.api)
        this._dao = new DAO(this.networkID, this.api)
        this._token = new Token(this.networkID, this.api)
        this._point = new Point(this.networkID, this.api)
    }

    get node(): Node {
        return this._node
    }

    get account(): Account {
        return this._account
    }

    get currency(): Currency {
        return this._currency
    }

    get block(): Block {
        return this._block
    }

    get operation(): Operation {
        return this._operation
    }

    get contract(): Contract {
        return this._contract
    }

    get nft(): NFT {
        return this._nft
    }

    get credential(): Credential {
        return this._credential
    }

    get timestamp(): TimeStamp {
        return this._timestamp
    }

    get sto(): STO {
        return this._sto
    }

    get kyc(): KYC {
        return this._kyc
    }

    get dao(): DAO {
        return this._dao
    }

    get token(): Token {
        return this._token
    }

    get point(): Point {
        return this._point
    }

    /**
     * @deprecated use setAPI(api?: string | IP)
     */
    setNode(api?: string) {
        this.setAPI(api)
    }

    setAPI(api?: string | IP) {
        super.setAPI(api)
        this.refresh()
    }

    /**
     * @deprecated use .api (get)
     */
    getNode(): string {
        return this.api.toString()
    }

    getAPI(): string {
        return this.api.toString()
    }

    getChain(): string {
        return this.networkID
    }

    setChain(networkID: string) {
        super.setNetworkID(networkID)
        this.refresh()
    }
}

export default Mitum