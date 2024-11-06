import { ContractFact, FactJson } from "../base"
import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { LongString } from "../../types"
// import { Config } from "../../node"
import { Assert, ECODE, MitumError } from "../../error"

export class CreateDidFact extends ContractFact {
    readonly publicKey: LongString
    readonly address: Address
    readonly authType: LongString
    readonly serviceType: LongString
	readonly serviceEndpoints: LongString
    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        address: string | Address,
        authType: string | LongString,
        publicKey: string | LongString,
        serviceType: string | LongString,
        serviceEndpoints: string | LongString,
        currency: string | CurrencyID,
    ) {
        super(HINT.DID.CREATE_DID.FACT, token, sender, contract, currency);
        this.address = Address.from(address);
        this.authType = LongString.from(authType);
        this.publicKey = LongString.from(publicKey);
        this.serviceType = LongString.from(serviceType);
        this.serviceEndpoints = LongString.from(serviceEndpoints);

        Assert.check(/^[0-9a-fA-F]+$/.test(publicKey.toString()), MitumError.detail(ECODE.INVALID_FACT, `${this.publicKey.toString()} is not a hexadecimal number`))
        // Assert.check(Config.DID.PUBLIC_KEY.satisfy(publicKey.toString().length),
        //     MitumError.detail(ECODE.INVALID_FACT, `publickey length out of range, should be over ${Config.DID.PUBLIC_KEY.min}`),
        // )

        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.address.toBuffer(),
            this.authType.toBuffer(),
            this.publicKey.toBuffer(),
            this.serviceType.toBuffer(),
            this.serviceEndpoints.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            address: this.address.toString(),
            authType: this.authType.toString(),
            publicKeyHex:  this.publicKey.toString(),
            serviceType: this.serviceType.toString(),
            serviceEndpoints: this.serviceEndpoints.toString()
        }
    }

    get operationHint() {
        return HINT.DID.CREATE_DID.OPERATION
    }
}