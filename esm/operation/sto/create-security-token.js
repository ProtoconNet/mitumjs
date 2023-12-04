import { STOItem } from "./item";
import { Partition } from "./partition";
import { OperationFact } from "../base";
import { HINT } from "../../alias";
import { Big } from "../../types";
import { Assert, ECODE, MitumError } from "../../error";
export class CreateSecurityTokenItem extends STOItem {
    granularity;
    defaultPartition;
    constructor(contract, granularity, defaultPartition, currency) {
        super(HINT.STO.CREATE_SECURITY_TOKEN.ITEM, contract, currency);
        this.granularity = Big.from(granularity);
        this.defaultPartition = Partition.from(defaultPartition);
        Assert.check(!this.granularity.isZero(), MitumError.detail(ECODE.INVALID_ITEM, "zero granularity"));
    }
    toBuffer() {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.granularity.toBuffer("fill"),
            this.defaultPartition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            granularity: this.granularity.v,
            default_partition: this.defaultPartition.toString(),
        };
    }
}
export class CreateSecurityTokenFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.STO.CREATE_SECURITY_TOKEN.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate contract found in items"));
    }
    get operationHint() {
        return HINT.STO.CREATE_SECURITY_TOKEN.OPERATION;
    }
}
//# sourceMappingURL=create-security-token.js.map