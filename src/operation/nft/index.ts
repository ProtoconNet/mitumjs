import { RegisterModelFact } from "./register-model"
import { UpdateModelConfigFact } from "./update-model-config"
import { MintItem, MintFact } from "./mint"
import { ApproveItem, ApproveFact } from "./approve"
import { ApproveAllItem, ApproveAlleFact } from "./approve-all"
import { TransferItem, TransferFact } from "./transfer"
import { AddSignatureItem, AddSignatureFact } from "./add-signature"

import { Signer, Signers } from "./signer"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
import { Big, IP, LongString, TimeStamp } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"
import { isSuccessResponse } from "../../utils"
import { Config } from "../../node"

type collectionData = {
    name: string | LongString
    uri: string | LongString
    royalty: string | number | Big
    minterWhitelist: (string | Address)[]
}

type Creator = {
    account: string | Address
    share: string | number | Big
}

export class NFT extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    private checkArrayLength(array: string[] | Address[] | LongString[], expectedLength: number, arrayName: string) {
        Assert.check(
            array.length === expectedLength,
            MitumError.detail(ECODE.INVALID_LENGTH, `length of ${arrayName} must be ${expectedLength}, but got ${array.length}`)
        );
    }

    /**
     * Generate `register-model` operation to register a new NFT model for creating a collection on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {collectionData} [data] - The collection data to be registed. The properties of `collectionData` include:
     * - {string | LongString} `name` - The name of the NFT collection.
     * - {string | LongString} `uri` - The uri of the NFT collection.
     * - {string | number | Big} `royalty` - The royalty of the NFT collection.
     * - {(string | Address)[]} `minterWhitelist` - Accounts who have permissions to mint. If it's empty, anyone can mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation
     */
    registerModel(
        contract: string | Address,
        sender: string | Address,
        data: collectionData,
        currency: string | CurrencyID,
    ) {
        const keysToCheck: (keyof collectionData)[] = ['name', 'uri', 'royalty', 'minterWhitelist'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`))
        });

        return new Operation(
            this.networkID,
            new RegisterModelFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                data.name,
                data.royalty,
                data.uri,
                data.minterWhitelist,
                currency,
            )
        )
    }
    
    /**
     * Generate `update-model-config` operation to update the policy of the nft collection on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {collectionData} [data] - The policy data for nft collection to be updated. The properties of `collectionData` include:
     * - {string | LongString} `name` - The name of the NFT collection.
     * - {string | LongString} `uri` - The uri of the NFT collection.
     * - {string | number | Big} `royalty` - The royalty of the NFT collection.
     * - {(string | Address)[]} `minterWhitelist` - Accounts who have permissions to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-model-config` operation.
     */
    updateModelConfig(
        contract: string | Address,
        sender: string | Address,
        data: collectionData,
        currency: string | CurrencyID,
    ) {
        const keysToCheck: (keyof collectionData)[] = ['name', 'uri', 'royalty', 'minterWhitelist'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`))
        });
        return new Operation(
            this.networkID,
            new UpdateModelConfigFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                data.name,
                data.royalty,
                data.uri,
                data.minterWhitelist,
                currency,
            ))
    }
    
    /**
     * Generate `mint` operation for minting a new NFT and assigns it to a receiver.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the newly minted NFT.
     * @param {string | LongString} [uri] - The URI of the NFT to mint.
     * @param {string | LongString} [hash] - The hash of the NFT to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [creator] - The address of the creator of the artwork for NFT.
     * @returns `mint` operation.
     */
    mint(
        contract: string | Address,
        sender: string | Address,
        receiver: string | Address,
        uri: string | LongString,
        hash: string | LongString,
        currency: string | CurrencyID,
        creator: string | Address,
    ) {
        return new Operation(this.networkID, new MintFact(TimeStamp.new().UTC(), sender, [new MintItem(
            contract,
            receiver,
            hash,
            uri,
            new Signers([new Signer(creator, 100, false)]),
            currency,
        )]))
    }
    
    /**
     * Generate `mint` operation with multiple item for minting N number of NFT and assigns it to a receiver.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receivers] - The array of address of the receiver of the newly minted NFT.
     * @param {number} [n] - The number of NFT to be minted.
     * @param {string | LongString} [uri] - The array of URI for the NFTs to mint.
     * @param {string | LongString} [hash] - The array of hash for the NFT to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [creator] - The address of the creator of the artwork for NFT.
     * @returns `mint` operation.
     */
    multiMint(
        contract: string | Address,
        sender: string | Address,
        receivers: string[] | Address[],
        n: number,
        uri: string[] | LongString[],
        hash: string[] | LongString[],
        currency: string | CurrencyID,
        creator: string | Address,
    ) {
        Assert.check(
            Config.ITEMS_IN_FACT.satisfy(n),
            MitumError.detail(ECODE.INVALID_ITEMS, "n is out of range")
        )
        this.checkArrayLength(receivers, n, "receivers");
        this.checkArrayLength(uri, n, "uri");
        this.checkArrayLength(hash, n, "hash");

        const items = Array.from({ length: n }).map((_, idx) => new MintItem(
            contract,
            receivers[idx],
            hash[idx],
            uri[idx],
            new Signers([new Signer(creator, 100, false)]),
            currency,
        ));
        return new Operation(this.networkID, new MintFact(TimeStamp.new().UTC(), sender, items))
    }
    
    /**
     * Generate `mint` operation in case of multiple creators.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the newly minted NFT.
     * @param {string | LongString} [uri] - The URI of the NFT to mint.
     * @param {string | LongString} [hash] - The hash of the NFT to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {Creator[]} [creators] - An array of Creator object which has address of the creator of the artwork for NFT with their respective shares. The properties of `Creator` include:
     * - {string | Address} `account` - The creator's address.
     * - {string | number | Big} `share` - The share for the artworks. The total share can not over 100.
     * @returns `mint` operation.
     */
    mintForMultiCreators(
        contract: string | Address,
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
                        contract,
                        receiver,
                        hash,
                        uri,
                        new Signers(
                            creators.map(a => new Signer(a.account, a.share, false)),
                        ),
                        currency,
                    )
                ]
            )
        )
    }
    
    /**
     * Generate `transfer` operation for transferring an NFT from one address to another.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the NFT.
     * @param {string | number | Big} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `transfer` operation.
     */
    transfer(
        contract: string | Address,
        sender: string | Address,
        receiver: string | Address,
        nftIdx: string | number | Big,
        currency: string | CurrencyID,
    ) {
        const fact = new TransferFact(
            TimeStamp.new().UTC(),
            sender,
            [
                new TransferItem(
                    contract,
                    receiver,
                    nftIdx,
                    currency,
                )
            ]
        )

        return new Operation(this.networkID, fact)
    }
    
    /**
     * Generate `approve` operation to approves NFT to another account (approved).
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The address of the sender of the NFT.
     * @param {string | Address} [approved] - The address being granted approval to manage the NFT.
     * @param {string | number | Big} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `approve` operation.
     */
    approve(
        contract: string | Address,
        sender: string | Address,
        approved: string | Address,
        nftIdx: string | number | Big,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new ApproveFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new ApproveItem(
                        contract,
                        approved,
                        nftIdx,
                        currency,
                    )
                ]
            )
        )
    }

    /**
     * Generate `approve-all` operation to grant or revoke approval for an account to manage all NFTs of the sender.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The address of the sender giving or revoking approval.
     * @param {string | Address} [approved] - The address being granted or denied approval to manage all NFTs.
     * @param {"allow" | "cancel"} [mode] - The mode indicating whether to allow or cancel the approval.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `approve-all` operation.
     */
    approveAll(
        contract: string | Address,
        sender: string | Address,
        approved: string | Address,
        mode: "allow" | "cancel",
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new ApproveAlleFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new ApproveAllItem(
                        contract,
                        approved,
                        mode,
                        currency,
                    )
                ]
            ),
        )
    }
    
    /**
     * Generate `add-signature` operation to signs an NFT as creator of the artwork.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The address of the creator signing the NFT.
     * @param {string | number | Big} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `sign` operation.
     */
    addSignature(
        contract: string | Address,
        sender: string | Address,
        nftIdx: string | number | Big,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new AddSignatureFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new AddSignatureItem(
                        contract,
                        nftIdx,
                        currency,
                    )
                ]
            )
        )
    }
    
    /**
     * Get information about an NFT collection on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the NFT collection:
     * - `_hint`: Hint for NFT design,
     * - `contract`: Address of the contract account,
     * - `creator`: Address of the creator,
     * - `active`: Bool represents activation,
     * - `policy`:
     * - - `_hint`: Hint for the NFT collection policy,
     * - - `name`: Name of the NFT collection,
     * - - `royalty`: Royalty of the NFT collection,
     * - - `uri`: URI of the NFT collection,
     * - - `minter_whitelist`: Array of the addresses of accounts who have permissions to mint
     */
    async getModelInfo(contract: string | Address) {
        Address.from(contract);
        return await getAPIData(() => contractApi.nft.getModel(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get the owner of a specific NFT.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | number | Big} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is the address of the NFT owner.
     */
    async getOwner(contract: string | Address, nftIdx: string | number | Big) {
        Address.from(contract);
        const response = await getAPIData(() => contractApi.nft.getNFT(
            this.api,
            contract,
            nftIdx,
            this.delegateIP
        ));

        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.owner ? response.data.owner : null;
        }
        return response
    }
    
    /**
     * Get the address approved to manage a specific NFT.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {number} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is an address of the approved account to manage the NFT.
     */
    async getApproved(contract: string | Address, nftIdx: number) {
        Address.from(contract);
        const response = await getAPIData(() => contractApi.nft.getNFT(
            this.api,
            contract,
            nftIdx,
            this.delegateIP
        ));

        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.approved ? response.data.approved : null;
        }
        return response
    }
    
    /**
     * Get the total supply of NFTs in a collection on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is the total supply of NFTs in the collection.
     */
    async getTotalSupply(contract: string | Address) {
        Address.from(contract);
        const response = await getAPIData(() => contractApi.nft.getNFTCount(
            this.api,
            contract,
            this.delegateIP,
        ));

        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.nft_total_supply? Number(response.data.nft_total_supply) : 0;
        }
        return response
    }
    
    /**
     * Get the URI of a specific NFT.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {number} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is the URI of the NFT.
     */
    async getURI(contract: string | Address, nftIdx: number) {
        Address.from(contract);
        const response = await getAPIData(() => contractApi.nft.getNFT(
            this.api,
            contract,
            nftIdx,
            this.delegateIP
        ));

        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.uri ? response.data.uri : null;
        }
        return response
    }
    
    /**
     * Get the address is approved to manage all NFTs of a sepecfic owner.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [owner] - The address of the NFT owner.
     * @returns `data` of `SuccessResponse` is approval information:
     * - `_hint`: Hint for NFT operators book,
     * - `operators`: Array of the addresses of accounts that have been delegated authority over all of the owner’s NFTs
     */
    async getApprovedAll(contract: string | Address, owner: string) {
        Address.from(contract);
        Address.from(owner);
        return await getAPIData(() => contractApi.nft.getAccountOperators(
            this.api,
            contract,
            owner,
            this.delegateIP
        ))
    }
    
    /**
     * Get detailed information about a specific NFT.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {number} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is detailed information about the NFT:
     * - `_hint`: Hint for NFT,
     * - `nft_idx`: Index of the NFT,
     * - `active`: Bool represents activation,
     * - `owner`: Address of the owner,
     * - `hash`: Hash for the NFT,
     * - `uri`: URI for the NFT,
     * - `approved`: Address of the approved account for the NFT,
     * - `creators`: Creator object,
     */
    async getNFT(contract: string | Address, nftIdx: number) {
        Address.from(contract);
        return await getAPIData(() => contractApi.nft.getNFT(
            this.api,
            contract,
            nftIdx,
            this.delegateIP
        ))
    }
    
    /**
     * Get information of all NFTs in a collection. If the optional parameter factHash is given, only the nft created by the operation is searched.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {number} [factHash] - (Optional) The hash of fact in the operation that minted NFT.
     * @param {number} [limit] - (Optional) The maximum number of items to retrieve.
     * @param {number} [offset] - (Optional) The number of items skip before starting to return data.
     * @param {boolean} [reverse] - (Optional) Whether to return the items in reverse newest order.
     * @returns `data` of `SuccessResponse` is an array of the information about all NFTs in the NFT collection:
     * - `_hint`: Hint for currency,
     * - `_embedded`:
     * - - `_hint`: Hint for NFT,
     * - - `nft_idx`: Index of the NFT,
     * - - `active`: Bool represents activation,
     * - - `owner`: Address of the owner,
     * - - `hash`: Hash for the NFT,
     * - - `uri`: URI for the NFT,
     * - - `approved`: Address of the approved account for the NFT,
     * - - `creators`: Creator object,
     * - `_links`: Links for additional information
     */
    async getNFTs(contract: string | Address, factHash?: string, limit?: number, offset?: number, reverse?: true) {
        Address.from(contract);
        return await getAPIData(() => contractApi.nft.getNFTs(
            this.api,
            contract,
            this.delegateIP,
            factHash,
            limit,
            offset,
            reverse
        ))
    }
}