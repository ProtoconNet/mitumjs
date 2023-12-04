import { HINT } from "../../alias";
import { Address } from "../../key";
import { Hint } from "../../common";
import { Big, LongString } from "../../types";
class Calldata {
    hint;
    constructor(hint) {
        this.hint = new Hint(hint);
    }
    toBuffer() {
        return Buffer.from([]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
        };
    }
}
export class TransferCalldata extends Calldata {
    sender;
    receiver;
    amount;
    constructor(sender, receiver, amount) {
        super(HINT.DAO.CALLDATA.TRANSFER);
        this.sender = Address.from(sender);
        this.receiver = Address.from(receiver);
        this.amount = amount;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            receiver: this.receiver.toString(),
            amount: this.amount.toHintedObject(),
        };
    }
}
export class GovernanceCalldata extends Calldata {
    policy;
    constructor(policy) {
        super(HINT.DAO.CALLDATA.GOVERNANCE);
        this.policy = policy;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.policy.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            policy: this.policy.toHintedObject(),
        };
    }
}
class Proposal {
    hint;
    proposer;
    startTime;
    constructor(hint, proposer, startTime) {
        this.hint = new Hint(hint);
        this.proposer = Address.from(proposer);
        this.startTime = Big.from(startTime);
    }
    toBuffer() {
        return Buffer.concat([
            this.proposer.toBuffer(),
            this.startTime.toBuffer("fill"),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            proposer: this.proposer.toString(),
            start_time: this.startTime.v,
        };
    }
}
export class CryptoProposal extends Proposal {
    calldata;
    constructor(proposer, startTime, calldata) {
        super(HINT.DAO.PROPOSAL.CRYPTO, proposer, startTime);
        this.calldata = calldata;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.calldata.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            call_data: this.calldata.toHintedObject(),
        };
    }
}
export class BizProposal extends Proposal {
    url;
    hash;
    options;
    constructor(proposer, startTime, url, hash, options) {
        super(HINT.DAO.PROPOSAL.BIZ, proposer, startTime);
        this.url = LongString.from(url);
        this.hash = LongString.from(hash);
        this.options = Big.from(options);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.url.toBuffer(),
            this.hash.toBuffer(),
            this.options.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            url: this.url.toString(),
            hash: this.hash.toString(),
            options: this.options.v,
        };
    }
}
//# sourceMappingURL=proposal.js.map