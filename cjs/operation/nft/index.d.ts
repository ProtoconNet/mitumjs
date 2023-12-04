import { CreateCollectionFact } from "./create-collection";
import { UpdateCollectionPolicyFact } from "./update-collection-policy";
import { MintFact } from "./mint";
import { ApproveFact } from "./approve";
import { DelegateFact } from "./delegate";
import { TransferFact } from "./transfer";
import { SignFact } from "./sign";
import { ContractGenerator, Operation } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { Big, IP, LongString } from "../../types";
type collectionData = {
    name: string | LongString;
    uri: string | LongString;
    royalty: string | number | Big;
    whitelist: (string | Address)[];
};
type Creator = {
    account: string | Address;
    share: string | number | Big;
};
export declare class NFT extends ContractGenerator {
    constructor(networkID: string, api?: string | IP);
    createCollection(contractAddr: string | Address, sender: string | Address, data: collectionData, currency: string | CurrencyID): Operation<CreateCollectionFact>;
    setPolicy(contractAddr: string | Address, sender: string | Address, data: collectionData, currency: string | CurrencyID): Operation<UpdateCollectionPolicyFact>;
    mint(contractAddr: string | Address, sender: string | Address, receiver: string | Address, uri: string | LongString, hash: string | LongString, currency: string | CurrencyID, creator: string | Address): Operation<MintFact>;
    mintForMultiCreators(contractAddr: string | Address, sender: string | Address, receiver: string | Address, uri: string | LongString, hash: string | LongString, currency: string | CurrencyID, creators: Creator[]): Operation<MintFact>;
    transfer(contractAddr: string | Address, sender: string | Address, receiver: string | Address, nftID: string | number | Big, currency: string | CurrencyID): Operation<TransferFact>;
    approve(contractAddr: string | Address, owner: string | Address, operator: string | Address, nftID: string | number | Big, currency: string | CurrencyID): Operation<ApproveFact>;
    setApprovalForAll(contractAddr: string | Address, owner: string | Address, operator: string | Address, mode: "allow" | "cancel", currency: string | CurrencyID): Operation<DelegateFact>;
    signNFT(contractAddr: string | Address, creator: string | Address, nftID: string | number | Big, currency: string | CurrencyID): Operation<SignFact>;
    getCollectionInfo(contractAddr: string | Address): Promise<any>;
    /**
     * @deprecated use getCollectionInfo()
     */
    getCollectionPolicy(contractAddr: string | Address): Promise<any>;
    ownerOf(contractAddr: string | Address, nftID: string | number | Big): Promise<any>;
    getApproved(contractAddr: string | Address, nftID: number): Promise<any>;
    totalSupply(contractAddr: string | Address): Promise<any>;
    tokenURI(contractAddr: string | Address, nftID: number): Promise<any>;
    isApprovedForAll(contractAddr: string | Address, owner: string): Promise<any>;
    getNFTInfo(contractAddr: string | Address, nftID: number): Promise<any>;
    getNFTs(contractAddr: string | Address): Promise<any>;
}
export {};
