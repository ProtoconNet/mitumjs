"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFT = void 0;
const create_collection_1 = require("./create-collection");
const update_collection_policy_1 = require("./update-collection-policy");
const mint_1 = require("./mint");
const approve_1 = require("./approve");
const delegate_1 = require("./delegate");
const transfer_1 = require("./transfer");
const sign_1 = require("./sign");
const signer_1 = require("./signer");
const base_1 = require("../base");
const api_1 = require("../../api");
const types_1 = require("../../types");
const error_1 = require("../../error");
class NFT extends base_1.ContractGenerator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    createCollection(contractAddr, sender, data, currency) {
        const keysToCheck = ['name', 'uri', 'royalty', 'whitelist'];
        keysToCheck.forEach((key) => {
            error_1.Assert.check(data[key] !== undefined, error_1.MitumError.detail(error_1.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`));
        });
        return new base_1.Operation(this.networkID, new create_collection_1.CreateCollectionFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, data.name, data.royalty, data.uri, data.whitelist, currency));
    }
    setPolicy(contractAddr, sender, data, currency) {
        const keysToCheck = ['name', 'uri', 'royalty', 'whitelist'];
        keysToCheck.forEach((key) => {
            error_1.Assert.check(data[key] !== undefined, error_1.MitumError.detail(error_1.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`));
        });
        return new base_1.Operation(this.networkID, new update_collection_policy_1.UpdateCollectionPolicyFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, data.name, data.royalty, data.uri, data.whitelist, currency));
    }
    mint(contractAddr, sender, receiver, uri, hash, currency, creator) {
        return new base_1.Operation(this.networkID, new mint_1.MintFact(types_1.TimeStamp.new().UTC(), sender, [new mint_1.MintItem(contractAddr, receiver, hash, uri, new signer_1.Signers(100, [new signer_1.Signer(creator, 100, false)]), currency)]));
    }
    mintForMultiCreators(contractAddr, sender, receiver, uri, hash, currency, creators) {
        const keysToCheck = ['account', 'share'];
        keysToCheck.forEach((key) => {
            creators.forEach((creator) => {
                error_1.Assert.check(creator[key] !== undefined, error_1.MitumError.detail(error_1.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the Creator structure`));
            });
        });
        return new base_1.Operation(this.networkID, new mint_1.MintFact(types_1.TimeStamp.new().UTC(), sender, [
            new mint_1.MintItem(contractAddr, receiver, hash, uri, new signer_1.Signers(creators.reduce((prev, next) => prev + types_1.Big.from(next.share).v, 0), creators.map(a => new signer_1.Signer(a.account, a.share, false))), currency)
        ]));
    }
    transfer(contractAddr, sender, receiver, nftID, currency) {
        const fact = new transfer_1.TransferFact(types_1.TimeStamp.new().UTC(), sender, [
            new transfer_1.TransferItem(contractAddr, receiver, nftID, currency)
        ]);
        return new base_1.Operation(this.networkID, fact);
    }
    approve(contractAddr, owner, operator, nftID, currency) {
        return new base_1.Operation(this.networkID, new approve_1.ApproveFact(types_1.TimeStamp.new().UTC(), owner, [
            new approve_1.ApproveItem(contractAddr, operator, nftID, currency)
        ]));
    }
    setApprovalForAll(contractAddr, owner, operator, mode, currency) {
        return new base_1.Operation(this.networkID, new delegate_1.DelegateFact(types_1.TimeStamp.new().UTC(), owner, [
            new delegate_1.DelegateItem(contractAddr, operator, mode, currency)
        ]));
    }
    signNFT(contractAddr, creator, nftID, currency) {
        return new base_1.Operation(this.networkID, new sign_1.SignFact(types_1.TimeStamp.new().UTC(), creator, [
            new sign_1.SignItem(contractAddr, nftID, currency)
        ]));
    }
    getCollectionInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, api_1.getAPIData)(() => api_1.contract.nft.getCollection(this.api, contractAddr));
            return data ? data._embedded : null;
        });
    }
    /**
     * @deprecated use getCollectionInfo()
     */
    getCollectionPolicy(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const design = yield this.getCollectionInfo(contractAddr);
            return design ? design.policy : null;
        });
    }
    ownerOf(contractAddr, nftID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, api_1.getAPIData)(() => api_1.contract.nft.getNFT(this.api, contractAddr, nftID));
            return data ? data._embedded.owner : null;
        });
    }
    getApproved(contractAddr, nftID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, api_1.getAPIData)(() => api_1.contract.nft.getNFT(this.api, contractAddr, nftID));
            return data ? data._embedded.approved : null;
        });
    }
    totalSupply(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, api_1.getAPIData)(() => api_1.contract.nft.getNFTs(this.api, contractAddr));
            return data ? data._embedded.length : null;
        });
    }
    tokenURI(contractAddr, nftID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, api_1.getAPIData)(() => api_1.contract.nft.getNFT(this.api, contractAddr, nftID));
            return data ? data._embedded.uri : null;
        });
    }
    isApprovedForAll(contractAddr, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.nft.getAccountOperators(this.api, contractAddr, owner));
        });
    }
    getNFTInfo(contractAddr, nftID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.nft.getNFT(this.api, contractAddr, nftID));
        });
    }
    getNFTs(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.nft.getNFTs(this.api, contractAddr));
        });
    }
}
exports.NFT = NFT;
//# sourceMappingURL=index.js.map