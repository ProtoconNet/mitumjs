import { RegisterTokenFact } from "./register-token"
import { MintFact } from "./mint"
import { BurnFact } from "./burn"
import { TransferFact } from "./transfer"
import { ApproveFact } from "./approve"
import { TransferFromFact } from "./transfer-from"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Big, IP, LongString, TimeStamp } from "../../types"

export class Token extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }

    registerToken(
        contractAddr: string | Address,
        sender: string | Address,
        tokenID: string | CurrencyID,
        currency: string | CurrencyID,
        symbol: string | LongString,
        amount?: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new RegisterTokenFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                tokenID,
                currency,
                symbol,
                amount ?? 0,
            )
        )
    }

    mint(
        contractAddr: string | Address,
        sender: string | Address,
        tokenID: string | CurrencyID,
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
                tokenID,
                currency,
                receiver,
                amount,
            )
        )
    }

    burn(
        contractAddr: string | Address,
        sender: string | Address,
        tokenID: string | CurrencyID,
        currency: string | CurrencyID,
        target: string | Address,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new BurnFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                tokenID,
                currency,
                target,
                amount,
            )
        )
    }

    transfer(
        contractAddr: string | Address,
        sender: string | Address,
        tokenID: string | CurrencyID,
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
                tokenID,
                currency,
                receiver,
                amount,
            )
        )
    }

    transferFrom(
        contractAddr: string | Address,
        sender: string | Address,
        tokenID: string | CurrencyID,
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
                tokenID,
                currency,
                receiver,
                target,
                amount,
            )
        )
    }

    approve(
        contractAddr: string | Address,
        sender: string | Address,
        tokenID: string | CurrencyID,
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
                tokenID,
                currency,
                approved,
                amount,
            )
        )
    }
}