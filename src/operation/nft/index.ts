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
        api?: string | IP,
    ) {
        super(networkID, api)
    }

    createCollection(
        contractAdd: string | Address,
        sender: string | Address,
        data: collectionData,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new CreateCollectionFact(
                TimeStamp.new().UTC(),
                sender,
                contractAdd,
                data.name,
                data.royalty,
                data.uri,
                data.whitelist,
                currency,
            )
        )
    }

    setPolicy(
        contractAdd: string | Address,
        sender: string | Address,
        data: collectionData,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new UpdateCollectionPolicyFact(
                TimeStamp.new().UTC(),
                sender,
                contractAdd,
                data.name,
                data.royalty,
                data.uri,
                data.whitelist,
                currency,
            ))
    }

    mint(
        contractAdd: string | Address,
        sender: string | Address,
        uri: string | LongString,
        hash: string | LongString,
        currency: string | CurrencyID,
        creator: string | Address,
    ) {
        return new Operation(this.networkID, new MintFact(TimeStamp.new().UTC(), sender, [new MintItem(
            contractAdd,
            hash,
            uri,
            new Signers(100, [new Signer(creator, 100, false)]),
            currency,
        )]))
    }

    mintForMultiCreators(
        contractAdd: string | Address,
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
                        contractAdd,
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
        contractAdd: string | Address,
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
                    contractAdd,
                    receiver,
                    nftID,
                    currency,
                )
            ]
        )

        return new Operation(this.networkID, fact)
    }

    approve(
        contractAdd: string | Address,
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
                        contractAdd,
                        operator,
                        nftID,
                        currency,
                    )
                ]
            )
        )
    }

    setApprovalForAll(
        contractAdd: string | Address,
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
                        contractAdd,
                        operator,
                        mode,
                        currency,
                    )
                ]
            ),
        )
    }

    signNFT(
        contractAdd: string | Address,
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
                        contractAdd,
                        nftID,
                        currency,
                    )
                ]
            )
        )
    }

    async getCollectionInfo(contractAdd: string | Address) {
        const data = await getAPIData(() => contract.nft.getCollection(this.api, contractAdd))
        return data ? data._embedded : null
    }

    /**
     * @deprecated use getCollectionInfo()
     */
    async getCollectionPolicy(contractAdd: string | Address) {
        const design = await this.getCollectionInfo(contractAdd)
        return design ? design.policy : null
    }

    async ownerOf(contractAdd: string | Address, nftID: string | number | Big) {
        const data = await getAPIData(() => contract.nft.getNFT(
            this.api,
            contractAdd,
            nftID,
        ))

        return data ? data._embedded.owner : null
    }

    async getApproved(contractAdd: string | Address, nftID: number) {
        const data = await getAPIData(() => contract.nft.getNFT(
            this.api,
            contractAdd,
            nftID,
        ))

        return data ? data._embedded.approved : null
    }

    async totalSupply(contractAdd: string | Address) {
        const data = await getAPIData(() => contract.nft.getNFTs(
            this.api,
            contractAdd,
        ))

        return data ? data._embedded.length : null
    }

    async tokenURI(contractAdd: string | Address, nftID: number) {
        const data = await getAPIData(() => contract.nft.getNFT(
            this.api,
            contractAdd,
            nftID,
        ))

        return data ? data._embedded.uri : null
    }

    async isApprovedForAll(contractAdd: string | Address, owner: string) {
        return await getAPIData(() => contract.nft.getAccountOperators(
            this.api,
            contractAdd,
            owner,
        ))
    }

    async getNFTInfo(contractAdd: string | Address, nftID: number) {
        return await getAPIData(() => contract.nft.getNFT(
            this.api,
            contractAdd,
            nftID,
        ))
    }
}