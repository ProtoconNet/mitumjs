import { HINT } from "../../alias"
import { Address } from "../../key"
import { LongString } from "../../types"
import { CurrencyID } from "../../common"
import { ContractFact, FactJson } from "../base"
// import { Config } from "../../node"
// import { Assert, ECODE, MitumError } from "../../error"


export class RegisterModelFact extends ContractFact {
    readonly didMethod: LongString
    readonly docContext: LongString
    readonly docAuthType: LongString
    readonly docSvcType: LongString
    readonly docSvcEndPoint: LongString

    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address,
        didMethod: string,
        docContext: string,
        docAuthType: string,
        docSvcType: string,
        docSvcEndPoint: string,
        currency: string | CurrencyID,
    ) {
        super(HINT.DID.REGISTER_MODEL.FACT, token, sender, contract, currency)
        
        // Assert.check(
        //     Config.DMILE.PROJECT.satisfy(project.toString().length),
        //     MitumError.detail(ECODE.INVALID_FACT, `project length out of range, should be between ${Config.DMILE.PROJECT.min} to ${Config.DMILE.PROJECT.max}`),
        // )

        this.didMethod = LongString.from(didMethod)
        this.docContext = LongString.from(docContext)
        this.docAuthType = LongString.from(docAuthType)
        this.docSvcType = LongString.from(docSvcType)
        this.docSvcEndPoint = LongString.from(docSvcEndPoint)
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.didMethod.toBuffer(),
            this.docContext.toBuffer(),
            this.docAuthType.toBuffer(),
            this.docSvcType.toBuffer(),
            this.docSvcEndPoint.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            didMethod: this.didMethod.toString(),
            docContext: this.docContext.toString(),
            docAuthType: this.docAuthType.toString(),
            docSvcType: this.docSvcType.toString(),
            docSvcEndPoint: this.docSvcEndPoint.toString(),
        }
    }

    get operationHint() {
        return HINT.DID.REGISTER_MODEL.OPERATION
    }
}

