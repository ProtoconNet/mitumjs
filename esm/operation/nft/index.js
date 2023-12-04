import { CreateCollectionFact } from "./create-collection";
import { UpdateCollectionPolicyFact } from "./update-collection-policy";
import { MintItem, MintFact } from "./mint";
import { ApproveItem, ApproveFact } from "./approve";
import { DelegateItem, DelegateFact } from "./delegate";
import { TransferItem, TransferFact } from "./transfer";
import { SignItem, SignFact } from "./sign";
import { Signer, Signers } from "./signer";
import { ContractGenerator, Operation } from "../base";
import { contract, getAPIData } from "../../api";
import { Big, TimeStamp } from "../../types";
import { Assert, ECODE, MitumError } from "../../error";
export class NFT extends ContractGenerator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    createCollection(contractAddr, sender, data, currency) {
        const keysToCheck = ['name', 'uri', 'royalty', 'whitelist'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`));
        });
        return new Operation(this.networkID, new CreateCollectionFact(TimeStamp.new().UTC(), sender, contractAddr, data.name, data.royalty, data.uri, data.whitelist, currency));
    }
    setPolicy(contractAddr, sender, data, currency) {
        const keysToCheck = ['name', 'uri', 'royalty', 'whitelist'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`));
        });
        return new Operation(this.networkID, new UpdateCollectionPolicyFact(TimeStamp.new().UTC(), sender, contractAddr, data.name, data.royalty, data.uri, data.whitelist, currency));
    }
    mint(contractAddr, sender, receiver, uri, hash, currency, creator) {
        return new Operation(this.networkID, new MintFact(TimeStamp.new().UTC(), sender, [new MintItem(contractAddr, receiver, hash, uri, new Signers(100, [new Signer(creator, 100, false)]), currency)]));
    }
    mintForMultiCreators(contractAddr, sender, receiver, uri, hash, currency, creators) {
        const keysToCheck = ['account', 'share'];
        keysToCheck.forEach((key) => {
            creators.forEach((creator) => {
                Assert.check(creator[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the Creator structure`));
            });
        });
        return new Operation(this.networkID, new MintFact(TimeStamp.new().UTC(), sender, [
            new MintItem(contractAddr, receiver, hash, uri, new Signers(creators.reduce((prev, next) => prev + Big.from(next.share).v, 0), creators.map(a => new Signer(a.account, a.share, false))), currency)
        ]));
    }
    transfer(contractAddr, sender, receiver, nftID, currency) {
        const fact = new TransferFact(TimeStamp.new().UTC(), sender, [
            new TransferItem(contractAddr, receiver, nftID, currency)
        ]);
        return new Operation(this.networkID, fact);
    }
    approve(contractAddr, owner, operator, nftID, currency) {
        return new Operation(this.networkID, new ApproveFact(TimeStamp.new().UTC(), owner, [
            new ApproveItem(contractAddr, operator, nftID, currency)
        ]));
    }
    setApprovalForAll(contractAddr, owner, operator, mode, currency) {
        return new Operation(this.networkID, new DelegateFact(TimeStamp.new().UTC(), owner, [
            new DelegateItem(contractAddr, operator, mode, currency)
        ]));
    }
    signNFT(contractAddr, creator, nftID, currency) {
        return new Operation(this.networkID, new SignFact(TimeStamp.new().UTC(), creator, [
            new SignItem(contractAddr, nftID, currency)
        ]));
    }
    async getCollectionInfo(contractAddr) {
        const data = await getAPIData(() => contract.nft.getCollection(this.api, contractAddr));
        return data ? data._embedded : null;
    }
    /**
     * @deprecated use getCollectionInfo()
     */
    async getCollectionPolicy(contractAddr) {
        const design = await this.getCollectionInfo(contractAddr);
        return design ? design.policy : null;
    }
    async ownerOf(contractAddr, nftID) {
        const data = await getAPIData(() => contract.nft.getNFT(this.api, contractAddr, nftID));
        return data ? data._embedded.owner : null;
    }
    async getApproved(contractAddr, nftID) {
        const data = await getAPIData(() => contract.nft.getNFT(this.api, contractAddr, nftID));
        return data ? data._embedded.approved : null;
    }
    async totalSupply(contractAddr) {
        const data = await getAPIData(() => contract.nft.getNFTs(this.api, contractAddr));
        return data ? data._embedded.length : null;
    }
    async tokenURI(contractAddr, nftID) {
        const data = await getAPIData(() => contract.nft.getNFT(this.api, contractAddr, nftID));
        return data ? data._embedded.uri : null;
    }
    async isApprovedForAll(contractAddr, owner) {
        return await getAPIData(() => contract.nft.getAccountOperators(this.api, contractAddr, owner));
    }
    async getNFTInfo(contractAddr, nftID) {
        return await getAPIData(() => contract.nft.getNFT(this.api, contractAddr, nftID));
    }
    async getNFTs(contractAddr) {
        return await getAPIData(() => contract.nft.getNFTs(this.api, contractAddr));
    }
}
//# sourceMappingURL=index.js.map