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
import { isSuccessResponse } from "../../utils"

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
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    /**
     * Generate `create-collection` operation for creating a new NFT collection on the contract.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {collectionData} [data] - The collection data to be registed. The properties of `collectionData` include:
     * - {string | LongString} `name` - The name of the NFT collection.
     * - {string | LongString} `uri` - The uri of the NFT collection.
     * - {string | number | Big} `royalty` - The royalty of the NFT collection.
     * - {(string | Address)[]} `whitelist` - Accounts who have permissions to mint. If it's empty, anyone can mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-collection` operation
     */
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
    
    /**
     * Generate `update-collection` operation for updating the policy of an existing NFT collection on the contract.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {collectionData} [data] - The collection data to be registed. The properties of `collectionData` include:
     * - {string | LongString} `name` - The name of the NFT collection.
     * - {string | LongString} `uri` - The uri of the NFT collection.
     * - {string | number | Big} `royalty` - The royalty of the NFT collection.
     * - {(string | Address)[]} `whitelist` - Accounts who have permissions to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-collection` operation.
     */
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
    
    /**
     * Generate `mint` operation for minting a new NFT and assigns it to a receiver.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the newly minted NFT.
     * @param {string | LongString} [uri] - The URI of the NFT to mint.
     * @param {string | LongString} [hash] - The hash of the NFT to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [creator] - The address of the creator of the artwork for NFT.
     * @returns `mint` operation.
     */
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
    
    /**
     * Generate `mint` operation with multiple item for minting N number of NFT and assigns it to a receiver.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the newly minted NFT.
     * @param {number} [n] - The number of NFT to be minted.
     * @param {string | LongString} [uri] - The URI of the NFT to mint.
     * @param {string | LongString} [hash] - The hash of the NFT to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [creator] - The address of the creator of the artwork for NFT.
     * @returns `mint` operation.
     */
    multiMint(
        contractAddr: string | Address,
        sender: string | Address,
        receiver: string | Address,
        n: number,
        uri: string | LongString,
        hash: string | LongString,
        currency: string | CurrencyID,
        creator: string | Address,
    ) {
        const items = Array.from({ length: n }).map(() => new MintItem(
            contractAddr,
            receiver,
            hash,
            uri,
            new Signers(100, [new Signer(creator, 100, false)]),
            currency,
        ));
        return new Operation(this.networkID, new MintFact(TimeStamp.new().UTC(), sender, items))
    }
    
    /**
     * Generate `mint` operation in case of multiple creators.
     * @param {string | Address} [contractAddr] - The contract's address.
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
    
    /**
     * Generate `transfer` operation for transferring an NFT from one address to another.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the NFT.
     * @param {string | number | Big} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `transfer` operation.
     */
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
    
    /**
     * Generate `approve` operation to approves NFT to another account (operator).
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [owner] - The address of the owner of the NFT.
     * @param {string | Address} [operator] - The address being granted approval to manage the NFT.
     * @param {string | number | Big} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `approve` operation.
     */
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
    
    /**
     * Generate `delegate` operation to sets or cancels the approval for an operator to manage all NFTs of the owner.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [owner] - The address of the owner of the NFT.
     * @param {string | Address} [operator] - The address being granted or denied approval to manage all NFTs.
     * @param {"allow" | "cancel"} [mode] - The mode indicating whether to allow or cancel the approval.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `delegate` operation.
     */
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
    
    /**
     * Generate `sign` operation to signs an NFT as creator of the artwork.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [creator] - The address of the creator signing the NFT.
     * @param {string | number | Big} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `sign` operation.
     */
    sign(
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
    
    /**
     * Get information about an NFT collection on the contract.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the NFT collection:
     * - `_hint`: Hint for NFT design,
     * - `parent`: Address of the contract account,
     * - `creator`: Address of the creator,
     * - `active`: Bool represents activation,
     * - `policy`:
     * - - `_hint`: Hint for the NFT collection policy,
     * - - `name`: Name of the NFT collection,
     * - - `royalty`: Royalty of the NFT collection,
     * - - `uri`: URI of the NFT collection,
     * - - `whitelist`: Array of the addresses of accounts who have permissions to mint
     */
    async getCollectionInfo(contractAddr: string | Address) {
        Address.from(contractAddr);
        return await getAPIData(() => contract.nft.getCollection(this.api, contractAddr, this.delegateIP))
    }
    
    /**
     * Get the owner of a specific NFT.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | number | Big} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is the address of the NFT owner.
     */
    async ownerOf(contractAddr: string | Address, nftID: string | number | Big) {
        Address.from(contractAddr);
        const response = await getAPIData(() => contract.nft.getNFT(
            this.api,
            contractAddr,
            nftID,
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
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {number} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is an address of the approved account to manage the NFT.
     */
    async getApproved(contractAddr: string | Address, nftID: number) {
        Address.from(contractAddr);
        const response = await getAPIData(() => contract.nft.getNFT(
            this.api,
            contractAddr,
            nftID,
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
     * @param {string | Address} [contractAddr] - The contract's address.
     * @returns `data` of `SuccessResponse` is the total supply of NFTs in the collection.
     */
    async totalSupply(contractAddr: string | Address) {
        Address.from(contractAddr);
        const response = await getAPIData(() => contract.nft.getNFTCount(
            this.api,
            contractAddr,
            this.delegateIP,
        ));

        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.nft_count? Number(response.data.nft_count) : 0;
        }
        return response
    }
    
    /**
     * Get the URI of a specific NFT.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {number} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is the URI of the NFT.
     */
    async tokenURI(contractAddr: string | Address, nftID: number) {
        Address.from(contractAddr);
        const response = await getAPIData(() => contract.nft.getNFT(
            this.api,
            contractAddr,
            nftID,
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
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string} [owner] - The address of the NFT owner.
     * @returns `data` of `SuccessResponse` is approval information:
     * - `_hint`: Hint for NFT operators book,
     * - `operators`: Array of the addresses of accounts that have been delegated authority over all of the owner’s NFTs
     */
    async isApprovedForAll(contractAddr: string | Address, owner: string) {
        Address.from(contractAddr);
        Address.from(owner);
        return await getAPIData(() => contract.nft.getAccountOperators(
            this.api,
            contractAddr,
            owner,
            this.delegateIP
        ))
    }
    
    /**
     * Get detailed information about a specific NFT.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {number} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is detailed information about the NFT:
     * - `_hint`: Hint for NFT,
     * - `id`: Index of the NFT,
     * - `active`: Bool represents activation,
     * - `owner`: Address of the owner,
     * - `hash`: Hash for the NFT,
     * - `uri`: URI for the NFT,
     * - `approved`: Address of the approved account for the NFT,
     * - `creators`: Creator object,
     */
    async getNFTInfo(contractAddr: string | Address, nftID: number) {
        Address.from(contractAddr);
        return await getAPIData(() => contract.nft.getNFT(
            this.api,
            contractAddr,
            nftID,
            this.delegateIP
        ))
    }
    
    /**
     * Get information of all NFTs in a collection. If the optional parameter factHash is given, only the nft created by the operation is searched.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {number} [factHash] - (Optional) The hash of fact in the operation that minted NFT.
     * @param {number} [limit] - (Optional) The maximum number of items to retrieve.
     * @param {number} [offset] - (Optional) The number of items skip before starting to return data.
     * @param {boolean} [reverse] - (Optional) Whether to return the items in reverse newest order.
     * @returns `data` of `SuccessResponse` is an array of the information about all NFTs in the NFT collection:
     * - `_hint`: Hint for currency,
     * - `_embedded`:
     * - - `_hint`: Hint for NFT,
     * - - `id`: Index of the NFT,
     * - - `active`: Bool represents activation,
     * - - `owner`: Address of the owner,
     * - - `hash`: Hash for the NFT,
     * - - `uri`: URI for the NFT,
     * - - `approved`: Address of the approved account for the NFT,
     * - - `creators`: Creator object,
     * - `_links`: Links for additional information
     */
    async getNFTs(contractAddr: string | Address, factHash?: string, limit?: number, offset?: number, reverse?: true) {
        Address.from(contractAddr);
        return await getAPIData(() => contract.nft.getNFTs(
            this.api,
            contractAddr,
            this.delegateIP,
            factHash,
            limit,
            offset,
            reverse
        ))
    }
}