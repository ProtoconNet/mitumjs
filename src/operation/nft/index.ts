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
import { Assert, ECODE, MitumError } from "../../error"

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
        contractAddr: string | Address,
        sender: string | Address,
        data: collectionData,
        currency: string | CurrencyID,
    ) {
        const keysToCheck: (keyof collectionData)[] = ['name', 'uri', 'royalty', 'whitelist'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`))
        });

        return new Operation(
            this.networkID,
            new CreateCollectionFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                data.name,
                data.royalty,
                data.uri,
                data.whitelist,
                currency,
            )
        )
    }

    setPolicy(
        contractAddr: string | Address,
        sender: string | Address,
        data: collectionData,
        currency: string | CurrencyID,
    ) {
        const keysToCheck: (keyof collectionData)[] = ['name', 'uri', 'royalty', 'whitelist'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`))
        });
        return new Operation(
            this.networkID,
            new UpdateCollectionPolicyFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                data.name,
                data.royalty,
                data.uri,
                data.whitelist,
                currency,
            ))
    }

    mint(
        contractAddr: string | Address,
        sender: string | Address,
        receiver: string | Address,
        uri: string | LongString,
        hash: string | LongString,
        currency: string | CurrencyID,
        creator: string | Address,
    ) {
        return new Operation(this.networkID, new MintFact(TimeStamp.new().UTC(), sender, [new MintItem(
            contractAddr,
            receiver,
            hash,
            uri,
            new Signers(100, [new Signer(creator, 100, false)]),
            currency,
        )]))
    }

    mintForMultiCreators(
        contractAddr: string | Address,
        sender: string | Address,
        receiver: string | Address,
        uri: string | LongString,
        hash: string | LongString,
        currency: string | CurrencyID,
        creators: Creator[]
    ) {
        const keysToCheck: (keyof Creator)[] = ['account', 'share'];
        keysToCheck.forEach((key) => {
            creators.forEach((creator) => {
                Assert.check(creator[key] !== undefined, 
                    MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the Creator structure`))
            })
        });
        return new Operation(
            this.networkID,
            new MintFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new MintItem(
                        contractAddr,
                        receiver,
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
        contractAddr: string | Address,
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
                    contractAddr,
                    receiver,
                    nftID,
                    currency,
                )
            ]
        )

        return new Operation(this.networkID, fact)
    }

    approve(
        contractAddr: string | Address,
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
                        contractAddr,
                        operator,
                        nftID,
                        currency,
                    )
                ]
            )
        )
    }

    setApprovalForAll(
        contractAddr: string | Address,
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
                        contractAddr,
                        operator,
                        mode,
                        currency,
                    )
                ]
            ),
        )
    }

    signNFT(
        contractAddr: string | Address,
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
                        contractAddr,
                        nftID,
                        currency,
                    )
                ]
            )
        )
    }

    async getCollectionInfo(contractAddr: string | Address) {
        const data = await getAPIData(() => contract.nft.getCollection(this.api, contractAddr))
        return data ? data._embedded : null
    }

    /**
     * @deprecated use getCollectionInfo()
     */
    async getCollectionPolicy(contractAddr: string | Address) {
        const design = await this.getCollectionInfo(contractAddr)
        return design ? design.policy : null
    }

    async ownerOf(contractAddr: string | Address, nftID: string | number | Big) {
        const data = await getAPIData(() => contract.nft.getNFT(
            this.api,
            contractAddr,
            nftID,
        ))

        return data ? data._embedded.owner : null
    }

    async getApproved(contractAddr: string | Address, nftID: number) {
        const data = await getAPIData(() => contract.nft.getNFT(
            this.api,
            contractAddr,
            nftID,
        ))

        return data ? data._embedded.approved : null
    }

    async totalSupply(contractAddr: string | Address) {
        const data = await getAPIData(() => contract.nft.getNFTs(
            this.api,
            contractAddr,
        ))

        return data ? data._embedded.length : null
    }

    async tokenURI(contractAddr: string | Address, nftID: number) {
        const data = await getAPIData(() => contract.nft.getNFT(
            this.api,
            contractAddr,
            nftID,
        ))

        return data ? data._embedded.uri : null
    }

    async isApprovedForAll(contractAddr: string | Address, owner: string) {
        return await getAPIData(() => contract.nft.getAccountOperators(
            this.api,
            contractAddr,
            owner,
        ))
    }

    async getNFTInfo(contractAddr: string | Address, nftID: number) {
        return await getAPIData(() => contract.nft.getNFT(
            this.api,
            contractAddr,
            nftID,
        ))
    }

    async getNFTs(contractAddr: string | Address) {
        return await getAPIData(() => contract.nft.getNFTs(
            this.api,
            contractAddr,
        ))
    }
}