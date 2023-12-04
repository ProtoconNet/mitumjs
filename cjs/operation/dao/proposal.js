"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BizProposal = exports.CryptoProposal = exports.GovernanceCalldata = exports.TransferCalldata = void 0;
const alias_1 = require("../../alias");
const key_1 = require("../../key");
const common_1 = require("../../common");
const types_1 = require("../../types");
class Calldata {
    constructor(hint) {
        this.hint = new common_1.Hint(hint);
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
class TransferCalldata extends Calldata {
    constructor(sender, receiver, amount) {
        super(alias_1.HINT.DAO.CALLDATA.TRANSFER);
        this.sender = key_1.Address.from(sender);
        this.receiver = key_1.Address.from(receiver);
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
        return Object.assign(Object.assign({}, super.toHintedObject()), { sender: this.sender.toString(), receiver: this.receiver.toString(), amount: this.amount.toHintedObject() });
    }
}
exports.TransferCalldata = TransferCalldata;
class GovernanceCalldata extends Calldata {
    constructor(policy) {
        super(alias_1.HINT.DAO.CALLDATA.GOVERNANCE);
        this.policy = policy;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.policy.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { policy: this.policy.toHintedObject() });
    }
}
exports.GovernanceCalldata = GovernanceCalldata;
class Proposal {
    constructor(hint, proposer, startTime) {
        this.hint = new common_1.Hint(hint);
        this.proposer = key_1.Address.from(proposer);
        this.startTime = types_1.Big.from(startTime);
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
class CryptoProposal extends Proposal {
    constructor(proposer, startTime, calldata) {
        super(alias_1.HINT.DAO.PROPOSAL.CRYPTO, proposer, startTime);
        this.calldata = calldata;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.calldata.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { call_data: this.calldata.toHintedObject() });
    }
}
exports.CryptoProposal = CryptoProposal;
class BizProposal extends Proposal {
    constructor(proposer, startTime, url, hash, options) {
        super(alias_1.HINT.DAO.PROPOSAL.BIZ, proposer, startTime);
        this.url = types_1.LongString.from(url);
        this.hash = types_1.LongString.from(hash);
        this.options = types_1.Big.from(options);
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
        return Object.assign(Object.assign({}, super.toHintedObject()), { url: this.url.toString(), hash: this.hash.toString(), options: this.options.v });
    }
}
exports.BizProposal = BizProposal;
//# sourceMappingURL=proposal.js.map