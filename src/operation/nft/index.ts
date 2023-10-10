import { CreateCollectionFact } from "./create-collection"
import { UpdateCollectionPolicyFact } from "./update-collection-policy"
import { MintItem, MintFact } from "./mint"
import { ApproveItem, ApproveFact } from "./approve"
import { DelegateItem, DelegateFact } from "./delegate"
import { TransferItem, TransferFact } from "./transfer"
import { SignItem, SignFact } from "./sign"

import { Signer, Signers } from "./signer"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contract, getAPIData } from "../../api"
import { Big, IP, LongString, TimeStamp } from "../../types"

type collectionData = {
    name: string | LongString
    uri: string | LongString
    royalty: string | number | Big
    whitelist: (string | Address)[]
}

type Creator = {
    account: string | Address
    share: string | number | Big
}

export class NFT extends ContractGenerator {
    constructor(
        networkID: string,
        contract?: string | Address,
        api?: string | IP,
    ) {
        super(networkID, contract, api)
    }

    createCollection(
        sender: string | Address,
        data: collectionData,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new CreateCollectionFact(
                TimeStamp.new().UTC(),
                sender,
                this.contract,
                data.name,
                data.royalty,
                data.uri,
                data.whitelist,
                currency,
            )
        )
    }

    setPolicy(
        sender: string | Address,
        data: collectionData,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new UpdateCollectionPolicyFact(
                TimeStamp.new().UTC(),
                sender,
                this.contract,
                data.name,
                data.royalty,
                data.uri,
                data.whitelist,
                currency,
            ))
    }

    mint(
        sender: string | Address,
        uri: string | LongString,
        hash: string | LongString,
        creator: string | Address,
        currency: string | CurrencyID,
    ) {
        return new Operation(this.networkID, new MintFact(TimeStamp.new().UTC(), sender, [new MintItem(
            this.contract,
            hash,
            uri,
            new Signers(100, [new Signer(creator, 100, false)]),
            currency,
        )]))
    }

    mintForMultiCreators(
        sender: string | Address,
        uri: string | LongString,
        hash: string | LongString,
        currency: string | CurrencyID,
        creators: Creator[]
    ) {
        return new Operation(
            this.networkID,
            new MintFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new MintItem(
                        this.contract,
                        hash,
                        uri,
                        new Signers(
                            creators.reduce((prev, next) => prev + Big.from(next.share).v, 0),
                            creators.map(a => new Signer(a.account, a.share, false)),
                        ),
                        currency,
                    )
                ]
            )
        )
    }

    transfer(
        sender: string | Address,
        receiver: string | Address,
        nftID: string | number | Big,
        currency: string | CurrencyID,
    ) {
        const fact = new TransferFact(
            TimeStamp.new().UTC(),
            sender,
            [
                new TransferItem(
                    this.contract,
                    receiver,
                    nftID,
                    currency,
                )
            ]
        )

        return new Operation(this.networkID, fact)
    }

    approve(
        owner: string | Address,
        operator: string | Address,
        nftID: string | number | Big,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new ApproveFact(
                TimeStamp.new().UTC(),
                owner,
                [
                    new ApproveItem(
                        this.contract,
                        operator,
                        nftID,
                        currency,
                    )
                ]
            )
        )
    }

    setApprovalForAll(
        owner: string | Address,
        operator: string | Address,
        mode: "allow" | "cancel",
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new DelegateFact(
                TimeStamp.new().UTC(),
                owner,
                [
                    new DelegateItem(
                        this.contract,
                        operator,
                        mode,
                        currency,
                    )
                ]
            ),
        )
    }

    signNFT(
        creator: string | Address,
        nftID: string | number | Big,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new SignFact(
                TimeStamp.new().UTC(),
                creator,
                [
                    new SignItem(
                        this.contract,
                        nftID,
                        currency,
                    )
                ]
            )
        )
    }

    async getCollectionInfo() {
        const data = await getAPIData(() => contract.nft.getCollection(this.api, this.contract))
        return data ? data._embedded : null
    }

    /**
     * @deprecated use getCollectionInfo()
     */
    async getCollectionPolicy() {
        const design = await this.getCollectionInfo()
        return design ? design.policy : null
    }

    async ownerOf(nftID: string | number | Big) {
        const data = await getAPIData(() => contract.nft.getNFT(
            this.api,
            this.contract,
            nftID,
        ))

        return data ? data._embedded.owner : null
    }

    async getApproved(nftID: number) {
        const data = await getAPIData(() => contract.nft.getNFT(
            this.api,
            this.contract,
            nftID,
        ))

        return data ? data._embedded.approved : null
    }

    async totalSupply() {
        const data = await getAPIData(() => contract.nft.getNFTs(
            this.api,
            this.contract,
        ))

        return data ? data._embedded.length : null
    }

    async tokenURI(nftID: number) {
        const data = await getAPIData(() => contract.nft.getNFT(
            this.api,
            this.contract,
            nftID,
        ))

        return data ? data._embedded.uri : null
    }

    async isApprovedForAll(owner: string) {
        return await getAPIData(() => contract.nft.getAccountOperators(
            this.api,
            this.contract,
            owner,
        ))
    }

    async getNFTInfo(nftID: number) {
        return await getAPIData(() => contract.nft.getNFT(
            this.api,
            this.contract,
            nftID,
        ))
    }
}