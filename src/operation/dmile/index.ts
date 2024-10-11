import { RegisterModelFact } from "./register-model"
import { CreateDataFact } from "./create-data"
import { MigrateDataFact, MigrateDataItem } from "./migrate-data"
import { ContractGenerator, Operation } from "../base"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
import { isSuccessResponse  } from "../../utils"
import { Config } from "../../node"
import { IP, TimeStamp as TS, URIString, LongString } from "../../types"
import { Assert, MitumError, ECODE } from "../../error"

export class Dmile extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }
    
    /**
     * Generate a `register-model` operation to register new dmile model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | LongString} [project] - The project's name
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(
        contract: string | Address,
        sender: string | Address,
        project: string | LongString,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RegisterModelFact(
                TS.new().UTC(),
                sender,
                contract,
                project,
                currency,
            )
        )
    }
    
    /**
     * Generate `create-data` operation to create data with new merkle root on the dmile model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | LongString} [merkleRoot] - Value of the merkle root to record.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-data` operation
     */
    createData(
        contract: string | Address,
        sender: string | Address,
        merkleRoot: string | LongString,
        currency: string | CurrencyID,
    ) {
        new URIString(merkleRoot.toString(), 'merkleRoot');
        const fact = new CreateDataFact(
            TS.new().UTC(),
            sender,
            contract,
            merkleRoot,
            currency,
        )

        return new Operation(this.networkID, fact)
    }
    
    /**
     * Generate `migrate-data` operation to migrate data with multiple merkle root and tx hash to the dmile model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string[] | LongString[]} [merkleRoots] - array with multiple merkle roots to record.
     * @param {string[] | LongString[]} [txHashes] - array with multiple tx hashes.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `migrate-data` operation
     */
    migrateData(
        contract: string | Address,
        sender: string | Address,
        merkleRoots: string[] | LongString[],
        txHashes: string[] | LongString[],
        currency: string | CurrencyID,
    ) {
        Assert.check(
            merkleRoots.length !== 0 && txHashes.length !== 0, 
            MitumError.detail(ECODE.INVALID_LENGTH, "The array must not be empty."),
        )
        Assert.check(
            new Set(merkleRoots.map(it => it.toString())).size === merkleRoots.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicated merkleRoot founded")
        )
        Assert.check(
            new Set(txHashes.map(it => it.toString())).size === txHashes.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicated tx hash founded")
        )
        Assert.check(
            merkleRoots.length === txHashes.length, 
            MitumError.detail(ECODE.INVALID_LENGTH, "The lengths of the merkleRoots and txHashes must be the same."),
        )
        return new Operation(
            this.networkID,
            new MigrateDataFact(
                TS.new().UTC(),
                sender,
                merkleRoots.map((merkleRoot, idx) => new MigrateDataItem(contract, currency, merkleRoot.toString(), txHashes[idx].toString())
                ),
            ),
        )
    }

    /**
     * Get information about a dmile model on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the dmile service:
     * - `_hint`: Hint for dmile design,
     * - `project`: Project's name
     */
    async getModelInfo(contract: string | Address) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.dmile.getModel(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get tx hash by merkle root.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [merkleRoot] - The value of merkle root.
     * @returns `data` of `SuccessResponse` is tx hash related to the merkle root:
     * - `tx_hash`: The fact hash of create-data operation.
     */
    async getTxHashByByMerkleRoot(
        contract: string | Address,
        merkleRoot: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Assert.check(
            Config.DMILE.MERKLE_ROOT.satisfy(merkleRoot.toString().length),
            MitumError.detail(ECODE.INVALID_LENGTH, `merkleRoot length must be ${Config.DMILE.MERKLE_ROOT.min}`),
        )
        new URIString(merkleRoot, 'merkleRoot');
        const response = await getAPIData(() => contractApi.dmile.getByMerkleRoot(this.api, contract, merkleRoot, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.tx_hash ? {tx_hash: response.data.tx_hash} : null;
        }
        return response
    }

    /**
     * Get mekle root by tx hash.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [txHash] - The hash of create-data transaction.
     * @returns `data` of `SuccessResponse` is merkle root related to the tx hash:
     * - `merkle_root`: The merkle root value
     */
    async getMerkleRootByTxHash(
        contract: string | Address,
        txHash: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(txHash, 'txHash');
        const response = await getAPIData(() => contractApi.dmile.getByTxHash(
            this.api,
            contract,
            txHash,
            this.delegateIP,
        ));
        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.merkle_root ? {merkle_root: response.data.merkle_root} : null;
        }
        return response
    }

    /**
     * Get mekle root existence.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [merkleRoot] - The value of merkle root.
     * @returns If the data does not exist, an `ErrorResponse` is returned. Otherwise, a `SuccessResponse` is returned with `data` as shown below:
     * - `result`: "1"
     */
    async getMerkleRootExistence(
        contract: string | Address,
        merkleRoot: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Assert.check(
            Config.DMILE.MERKLE_ROOT.satisfy(merkleRoot.toString().length),
            MitumError.detail(ECODE.INVALID_LENGTH, `merkleRoot length must be ${Config.DMILE.MERKLE_ROOT.min}`),
        )
        new URIString(merkleRoot, 'merkleRoot');
        const response = await getAPIData(() => contractApi.dmile.getByMerkleRoot(this.api, contract, merkleRoot, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = {result : "1"}
        }
        return response
    }
}