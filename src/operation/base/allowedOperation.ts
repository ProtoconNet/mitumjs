import { Hint } from "../../common";
import { Address } from "../../key";
import { Allowed } from "./types";

export class AllowedOperation {
    readonly contract?: Address;
    readonly operationHint: Hint;

    constructor(operationHint: string, contract?: string | Address) {
        this.operationHint =
            Hint.hasVersion(operationHint)
                ? Hint.fromString(operationHint)
                : new Hint(operationHint);
    
        this.contract = contract
            ? contract instanceof Address
                ? contract
                : new Address(contract)
            : undefined;
    }

    toBuffer(): Buffer {
        if (!this.contract) {
            return Buffer.from(this.operationHint.toString());
        }

        return Buffer.concat([
            this.contract.toBuffer(),
            Buffer.from(this.operationHint.toString())
        ]);
    }

    toHintedObject(): Allowed {
        if (!this.contract) {
            return {
                operation: this.operationHint.toString()
            }
        }

        return {
            contract: this.contract.toString(),
            operation: this.operationHint.toString()
        }
    }
}