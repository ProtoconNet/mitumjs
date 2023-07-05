import { isIPAddress, isAddress } from "../../utils/validation.js";
import { OperationType } from "../../types/operation.js";
import { TimeStamp } from "../../utils/time.js";
import nftInfo from "./information.js";
import { MintItem, MintFact } from "./mint.js";
import { CollectionRegisterFact } from "./register.js";
import { CollectionPolicyUpdaterFact } from "./updatePolicy.js";
import { ApproveFact, ApproveItem } from "./approve.js";
import { DelegateItem, DelegateFact } from "./delegate.js";
import { gererateCreator } from "./sign.js";
export class Nft {
    constructor(networkID, provider) {
        this._networkID = "";
        this._node = "";
        this._address = "";
        this._collection = "";
        this._setNode(provider);
        this._setChain(networkID);
    }
    _setNode(provider) {
        if (isIPAddress(provider)) {
            this._node = provider;
        }
    }
    _setChain(networkID) {
        this._networkID = networkID;
    }
    setGallery(contractAddress, collectionID) {
        if (this._address !== contractAddress && isAddress(contractAddress)) {
            this._address = contractAddress;
            console.log("Contract address is changed : ", this._address);
        }
        else {
            console.error("This is invalid address type");
        }
        if (collectionID !== undefined) {
            this.setCollection(collectionID);
        }
    }
    setCollection(collectionID) {
        if (this._collection !== collectionID) {
            this._collection = collectionID;
            console.log("Collection ID is changed : ", this._collection);
        }
        else {
            console.error("This is invalid collection ID type");
        }
    }
    getContractAddress() {
        return this._address.toString();
    }
    getCollectionId() {
        return this._collection.toString();
    }
    async getCollectionInfo(collectionID) {
        let id = this._collection;
        if (collectionID !== undefined) {
            id = collectionID;
        }
        const res = await nftInfo.getCollectionInfo(this._node, this._address, id);
        return res.data;
    }
    // owner의 nft 갯수. TBD.
    // balanceOf() {}
    // tokenID의 소유자
    async ownerOf(tokenID, collectionID) {
        let id = this._collection;
        if (collectionID !== undefined) {
            id = collectionID;
        }
        const res = await nftInfo.getNftInfo(this._node, this._address, id, tokenID);
        return res.data.owner;
    }
    // collection의 이름 반환
    async name(collectionID) {
        let id = this._collection;
        if (collectionID !== undefined) {
            id = collectionID;
        }
        const res = await nftInfo.getCollectionInfo(this._node, this._address, id);
        return res.data.name;
    }
    symbol() {
        return this._collection;
    }
    // 총 nft 발행량 조회
    async totalSupply(collectionID) {
        let id = this._collection;
        if (collectionID !== undefined) {
            id = collectionID;
        }
        const res = await nftInfo.getAllNftInfo(this._node, this._address, id);
        return res.data.length;
    }
    // tokenID 에 대한 URI 반환
    async tokenURI(tokenID, collectionID) {
        let id = this._collection;
        if (collectionID !== undefined) {
            id = collectionID;
        }
        const res = await nftInfo.getNftInfo(this._node, this._address, id, tokenID);
        return res.data.uri;
    }
    /** structure
     * inputData = {
     *    contract: string;
     *    name: string;
     *    symbol: string;
     *    uri: string;
     *    royalty: string | number | Buffer | BigInt | Uint8Array
     *    whiteLists: string[],
     *    currencyID: string
     * }
     */
    createCollection(sender, data) {
        const token = new TimeStamp().UTC();
        const fact = new CollectionRegisterFact(token, sender, data.contract, data.symbol, data.name, data.royalty, data.uri, data.whiteLists, data.currencyID);
        return new OperationType(this._networkID, fact);
    }
    /** structure
     * inputData = {
     *    contract: string;
     *    name: string;
     *    symbol: string;
     *    uri: string;
     *    royalty: string | number | Buffer | BigInt | Uint8Array
     *    whiteLists: string[],
     *    currencyID: string
     * }
     */
    setPolicy(sender, data) {
        const token = new TimeStamp().UTC();
        const fact = new CollectionPolicyUpdaterFact(token, sender, data.contract, data.symbol, data.name, data.royalty, data.uri, data.whiteLists, data.currencyID);
        return new OperationType(this._networkID, fact);
    }
    mint(sender, uri, hash, currencyID, creator) {
        const originator = gererateCreator([{ account: creator, share: 100 }]);
        const token = new TimeStamp().UTC();
        const item = new MintItem(this._address, this._collection, hash, uri, originator, currencyID);
        const fact = new MintFact(token, sender, [item]);
        return new OperationType(this._networkID, fact);
    }
    mintForMultiCreators(sender, uri, hash, currencyID, creator) {
        const originators = gererateCreator(creator);
        const token = new TimeStamp().UTC();
        const item = new MintItem(this._address, this._collection, hash, uri, originators, currencyID);
        const fact = new MintFact(token, sender, [item]);
        return new OperationType(this._networkID, fact);
    }
    // nft 호환 컨트랙트 끼리의 안전한 전송. 이 함수가 오버로딩 되었다.
    transferFrom() { }
    // approve 위임받은 자의 전송
    transfer() { }
    // 위임
    approve(owner, operator, tokenID, currencyID) {
        const token = new TimeStamp().UTC();
        const item = new ApproveItem(this._address, this._collection, operator, tokenID, currencyID);
        const fact = new ApproveFact(token, owner, [item]);
        return new OperationType(this._networkID, fact);
    }
    // tokenId 가 위임되었는지 확인
    async getApproved(tokenID, collectionID) {
        let id = this._collection;
        if (collectionID !== undefined) {
            id = collectionID;
        }
        const res = await nftInfo.getNftInfo(this._node, this._address, id, tokenID);
        return res.data.approved;
    }
    // 소유한 모든 nft 를 위임
    setApprovalForAll(owner, operator, mode, currencyID) {
        const token = new TimeStamp().UTC();
        let approved = "allow";
        if (mode == false) {
            approved = "cancel";
        }
        const item = new DelegateItem(this._address, this._collection, operator, approved, currencyID);
        const fact = new DelegateFact(token, owner, [item]);
        return new OperationType(this._networkID, fact);
    }
    // 모든 nft 를 위임하였냐
    async isApprovedForAll(owner, collectionID) {
        let id = this._collection;
        if (collectionID !== undefined) {
            id = collectionID;
        }
        const res = await nftInfo.getOperationInfo(this._node, this._address, id, owner);
        return res.data;
    }
}
//# sourceMappingURL=index.js.map