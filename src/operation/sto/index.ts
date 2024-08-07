import { CreateSecurityTokenItem, CreateSecurityTokenFact } from "./create-security-token"
import { IssueItem, IssueFact } from "./issue"
import { AuthorizeOperatorItem, AuthorizeOperatorFact } from "./authorize-operator"
import { RevokeOperatorItem, RevokeOperatorFact } from "./revoke-operator"
import { RedeemItem, RedeemFact } from "./redeem"
import { SetDocumentFact } from "./set-document"
import { TransferByPartitionItem, TransferByPartitionFact } from "./transfer-by-partition"
import { contractApi, getAPIData } from "../../api"
import { Partition } from "./partition"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Big, IP, TimeStamp } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

type createServiceData = {
    granularity: string | number | Big
    defaultPartition: string | Partition
}

export class STO extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    /**
     * Generate `authorize-operator` operation to authorize an operator for the security token in specific partition.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [operator] - The operator's address to be authorized.
     * @param {string | Partition} [partition] - The partition ID.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `authorize-operator` operation.
     */
    authorizeOperator(
        contract: string | Address,
        sender: string | Address,
        operator: string | Address,
        partition: string | Partition,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new AuthorizeOperatorFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new AuthorizeOperatorItem(
                        contract,
                        operator,
                        partition,
                        currency,
                    )
                ]
            )
        )
    }

    /**
     * Generate `create-security-token` operation to create new security token.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {createServiceData} [data] - Data required to create the security token. The properties of `createServiceData` include:
     * - {string | number | Big} `granularity` - The basic unit of the token.
     * - {string | Partition} `defaultPartition` - Capital letters with length between 3 and 10 (can include numbers)
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-security-token` operation
     */
    createService(
        contract: string | Address,
        sender: string | Address,
        data: createServiceData,
        currency: string | CurrencyID,
    ) {
        const keysToCheck: (keyof createServiceData)[] = ['granularity', 'defaultPartition'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createServiceData structure`))
        });
        return new Operation(
            this.networkID,
            new CreateSecurityTokenFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateSecurityTokenItem(
                        contract,
                        data.granularity,
                        data.defaultPartition,
                        currency,
                    )
                ]
            ),
        )
    }

    /**
     * Generate `issue` operation to issue new security token in specific partition to a specified receiver.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | Partition} [partition] - The partition ID.
     * @param {string | number | Big} [amount] - The amount of tokens to issue.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `issue` operation.
     */
    issue(
        contract: string | Address,
        sender: string | Address,
        receiver: string | Address,
        partition: string | Partition,
        amount: string | number | Big,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new IssueFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new IssueItem(
                        contract,
                        receiver,
                        amount,
                        partition,
                        currency,
                    )
                ]
            )
        )
    }
    
    /**
     * Generate `redeem` operation to redeem(burn) a specified amount of security token in a specific partition.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [tokenHolder] - The token holder's address.
     * @param {string | Partition} [partition] - The partition ID.
     * @param {string | number | Big} [amount] - The amount of tokens to redeem.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `redeem` operation.
     */
    redeem(
        contract: string | Address,
        sender: string | Address,
        tokenHolder: string | Address,
        partition: string | Partition,
        amount: string | number | Big,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RedeemFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new RedeemItem(
                        contract,
                        tokenHolder,
                        amount,
                        partition,
                        currency,
                    )
                ]
            )
        )
    }
    
    /**
     * Generate `revoke` operation to revoke operator's authorization for the security token in specific partition.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [operator] - The operator's address.
     * @param {string | Partition} [partition] - The partition ID.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `revoke` operation.
     */
    revokeOperator(
        contract: string | Address,
        sender: string | Address,
        operator: string | Address,
        partition: string | Partition,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RevokeOperatorFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new RevokeOperatorItem(
                        contract,
                        operator,
                        partition,
                        currency,
                    )
                ]
            )
        )
    }
    
    /**
     * Generate `setDocumnet` operation to set document for the security token on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [title] - The title of the document.
     * @param {string} [uri] - The URI of the document.
     * @param {string} [documentHash] - The hash value of the document.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `setDocumnet` operation.
     */
    setDocument(
        contract: string | Address,
        sender: string | Address,
        title: string,
        uri: string,
        documentHash: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new SetDocumentFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                title,
                uri,
                documentHash,
                currency,
            )
        )
    }
    
    /**
     * Generate `transfer-by-partition` operation to transfer security token in specific partitions.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [holder] - The token holder's address.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | Partition} [partition] - The partition ID.
     * @param {string | number | Big} [amount] - The amount of tokens to transfer.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `transfer-by-partition` operation
     */
    transferByPartition(
        contract: string | Address,
        sender: string | Address,
        holder: string | Address,
        receiver: string | Address,
        partition: string | Partition,
        amount: string | number | Big,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new TransferByPartitionFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new TransferByPartitionItem(
                        contract,
                        holder,
                        receiver,
                        partition,
                        amount,
                        currency,
                    )
                ]
            )
        )
    }
    
    /**
     * Get information about the security token on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information of the security token:
     * - `_hint`: Hint for STO design,
     * - `granularity`: Basic unit for the token,
     * - `policy`: {
     *     _hint: Hint for the STO policy,
     *     partitions: Array of name of partition,
     *     aggregate: Total supply amount,
     *     documents: Array of information about documents with `_hint`, `title`, `hash`, `uri`
     * }
     */
    async getServiceInfo(contract: string | Address) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.sto.getService(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get partitions of given holder.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [holder] - The token holder's address.
     * @returns `data` of `SuccessResponse` is an array of token partition names owned by the holder.
     */
    async getPartitionsInfo(contract: string | Address, holder: string | Address) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Address.from(holder);
        return await getAPIData(() => contractApi.sto.getPartitions(this.api, contract, holder, this.delegateIP))
    }
        
    /**
     * Get balance of holder for the partition.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [holder] - The token holder's address.
     * @param {string} [partition] - The partition ID.
     * @returns `data` of `SuccessResponse` is the balance of holder for the partition
     */
    async getBalanceByHolder(contract: string | Address, holder: string | Address, partition: string) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Address.from(holder);
        return await getAPIData(() => contractApi.sto.getBalanceByHolder(this.api, contract, holder, partition, this.delegateIP))
    }
    
    /**
     * Get operators of the partition who granted by the holder.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [holder] - The token holder's address.
     * @param {string} [partition] - The partition ID.
     * @returns `data` of `SuccessResponse` is information of the operators:
     * - `operators`: Array of the address of operators.
     */
    async getOperatorsByHolder(contract: string | Address, holder: string | Address, partition: string) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Address.from(holder);
        return await getAPIData(() => contractApi.sto.getOperatorsByHolder(this.api, contract, holder, partition, this.delegateIP))
    }
    
    /**
     * Get balance for a specific partition.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [partition] - The partition ID.
     * @returns `data` of `SuccessResponse` is the partition balance amount.
     */
    async getPartitionBalanceInfo(contract: string | Address, partition: string) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.sto.getPartitionBalance(this.api, contract, partition, this.delegateIP))
    }
        
    /**
     * Get information about the holder who granted to the operator.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [operator] - The operator's address.
     * @returns `data` of `SuccessResponse` is information of holder:
     * - `holders`: Array of the address of holders.
     */
    async getAuthorizedInfo(contract: string | Address, operator: string | Address) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Address.from(operator);
        return await getAPIData(() => contractApi.sto.getAuthorized(this.api, contract, operator, this.delegateIP))
    }
}