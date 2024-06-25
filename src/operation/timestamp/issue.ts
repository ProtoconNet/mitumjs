import { FactJson } from "../base"
import { ContractFact } from "../base"

import { Big } from "../../types"
import { HINT } from "../../alias"
import { Config } from "../../node"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class IssueFact extends ContractFact {
    readonly projectID: string
    readonly requestTimeStamp: Big
    readonly data: string

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        projectID: string,
        requestTimeStamp: string | number | Big,
        data: string,
        currency: string | CurrencyID,
    ) {
        super(HINT.TIMESTAMP.ISSUE.FACT, token, sender, contract, currency)
        this.projectID = projectID
        this.requestTimeStamp = Big.from(requestTimeStamp)
        this.data = data

        Assert.check(
            Config.TIMESTAMP.PROJECT_ID.satisfy(this.projectID.length),
            MitumError.detail(ECODE.INVALID_FACT, "project id length out of range"),
        )

        Assert.check(
            Config.TIMESTAMP.DATA.satisfy(this.data.length),
            MitumError.detail(ECODE.INVALID_FACT, "data length out of range"),
        )
        
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.projectID),
            this.requestTimeStamp.toBuffer("fill"),
            Buffer.from(this.data),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            project_id: this.projectID,
            request_timestamp: this.requestTimeStamp.v,
            data: this.data,
        }
    }

    get operationHint() {
        return HINT.TIMESTAMP.ISSUE.OPERATION
    }
}