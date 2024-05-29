import { RegisterTokenFact } from "./register-token"
import { MintFact } from "./mint"
import { BurnFact } from "./burn"
import { TransferFact } from "./transfer"
import { ApproveFact } from "./approve"
import { TransferFromFact } from "./transfer-from"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contract, getAPIData } from "../../api"
import { Big, IP, LongString, TimeStamp } from "../../types"
import { calculateAllowance } from "../../utils/contractUtils"
import { isSuccessResponse } from "../../utils"

export class Token extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    /**
     * Generate a `register-token` operation for registering a token on a contract.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | LongString} [name] - The name of the token to register.
     * @param {string | CurrencyID} [symbol] - The symbol of the token to register.
     * @param {string | number | Big} [initialSupply] - (Optional) The initial supply of the token to register. If not provided, the default value is 0.
     * @returns `register-token` operation.
     */
    registerToken(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        name: string | LongString,
        symbol: string | CurrencyID,
        initialSupply?: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new RegisterTokenFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
                symbol,
                name,
                initialSupply ?? 0,
            )
        )
    }

    /**
     * Generate a `mint` operation for minting tokens and allocating them to a receiver.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [receiver] - The receiver's address. 
     * @param {string | number | Big} [amount] - The amount to mint.
     * @returns `mint` operation.
     */
    mint(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        receiver: string | Address,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new MintFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
                receiver,
                amount,
            )
        )
    }

    /**
     * Generate a `burn` operation for burning tokens from sender account.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The amount to burn.
     * @returns `burn` operation
     */
    burn(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new BurnFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
                amount,
            )
        )
    }

    /**
     * Generate an `transfer` operation for transferring tokens from the sender to a receiver.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency - The currency ID.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | number | Big} [amount] - The amount to transfer.
     * @returns `transfer` operation.
     */
    transfer(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        receiver: string | Address,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new TransferFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
                receiver,
                amount,
            )
        )
    }

    /**
     * Generate a `transfer-from` operation for transferring tokens from target account to receiver.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | Address} [target] - The target account's address.
     * @param {string | number | Big} [amount] - The amount to transfer.
     * @returns `transfer-from` operation.
     */
    transferFrom(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        receiver: string | Address,
        target: string | Address,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new TransferFromFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
                receiver,
                target,
                amount,
            )
        )
    }

    /**
     * Generate an `approve` operation for approving certain amount tokens to approved account.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [approved] - The address to approve.
     * @param {string | number | Big} [amount] - The amount to approve.
     * @returns `approve` operation
     */
    approve(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        approved: string | Address,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new ApproveFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
                approved,
                amount,
            )
        )
    }

    /**
     * Get information about the specific token on the contract.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @returns `data` of `SuccessResponse` is token information:
     * - `_hint`: Hint for token design,
     * - `symbol`: Symbol of the token,
     * - `name`: Name of the token,
     * - `policy`: Token policy object including `_hint`, `total_supply`, `approve_list`
     */
    async getTokenInfo(contractAddr: string | Address) {
        Address.from(contractAddr);
        return await getAPIData(() => contract.token.getToken(this.api, contractAddr, this.delegateIP))
    }

    /**
     * Get the allowance information granted by the owner for a specific token.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [owner] - The token owner's address.
     * @param {string | Address} [approved] - Address of approved account.
     * @returns `data` of `SuccessResponse` is token allowance information:
     * - `amount`: String of allowance amount
     */
    async getAllowance(contractAddr: string | Address, owner: string | Address, approved: string | Address) {
        Address.from(contractAddr);
        Address.from(owner);
        Address.from(approved);
        const response = await getAPIData(() => contract.token.getToken(this.api, contractAddr, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = calculateAllowance(response, owner, approved);
        }
        return response
    }

    /**
     * Get token balance for given account.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [owner] - The token owner's address.
     * @returns`data` of `SuccessResponse` is token balance information:
     * - `amount`: String of amount
     */
    async getTokenBalance(contractAddr: string | Address, owner: string | Address) {
        Address.from(contractAddr);
        Address.from(owner);
        return await getAPIData(() => contract.token.getTokenBalance(this.api, contractAddr, owner, this.delegateIP))
    }
}