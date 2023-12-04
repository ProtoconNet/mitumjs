import { TimeStampFact } from "./fact";
import { Big } from "../../types";
import { HINT } from "../../alias";
import { Config } from "../../node";
import { Assert, ECODE, MitumError } from "../../error";
export class AppendFact extends TimeStampFact {
    projectID;
    requestTimeStamp;
    data;
    constructor(token, sender, target, projectID, requestTimeStamp, data, currency) {
        super(HINT.TIMESTAMP.APPEND.FACT, token, sender, target, currency);
        this.projectID = projectID;
        this.requestTimeStamp = Big.from(requestTimeStamp);
        this.data = data;
        Assert.check(Config.TIMESTAMP.PROJECT_ID.satisfy(this.projectID.length), MitumError.detail(ECODE.INVALID_FACT, "project id length out of range"));
        Assert.check(Config.TIMESTAMP.DATA.satisfy(this.data.length), MitumError.detail(ECODE.INVALID_FACT, "data length out of range"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.projectID),
            this.requestTimeStamp.toBuffer("fill"),
            Buffer.from(this.data),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            projectid: this.projectID,
            request_timestamp: this.requestTimeStamp.v,
            data: this.data,
        };
    }
    get operationHint() {
        return HINT.TIMESTAMP.APPEND.OPERATION;
    }
}
//# sourceMappingURL=append.js.map