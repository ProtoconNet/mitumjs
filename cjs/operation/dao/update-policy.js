"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePolicyFact = void 0;
const base_1 = require("../base");
const types_1 = require("../../types");
const alias_1 = require("../../alias");
const node_1 = require("../../node");
const common_1 = require("../../common");
const error_1 = require("../../error");
class UpdatePolicyFact extends base_1.ContractFact {
    constructor(token, sender, contract, option, votingPowerToken, threshold, fee, whitelist, proposalReviewPeriod, registrationPeriod, preSnapshotPeriod, votingPeriod, postSnapshotPeriod, executionDelayPeriod, turnout, quorum, currency) {
        super(alias_1.HINT.DAO.UPDATE_POLICY.FACT, token, sender, contract, currency);
        this.option = option;
        this.votingPowerToken = common_1.CurrencyID.from(votingPowerToken);
        this.threshold = types_1.Big.from(threshold);
        this.fee = fee;
        this.whitelist = whitelist;
        this.proposalReviewPeriod = types_1.Big.from(proposalReviewPeriod);
        this.registrationPeriod = types_1.Big.from(registrationPeriod);
        this.preSnapshotPeriod = types_1.Big.from(preSnapshotPeriod);
        this.votingPeriod = types_1.Big.from(votingPeriod);
        this.postSnapshotPeriod = types_1.Big.from(postSnapshotPeriod);
        this.executionDelayPeriod = types_1.Big.from(executionDelayPeriod);
        this.turnout = types_1.Big.from(turnout);
        this.quorum = types_1.Big.from(quorum);
        error_1.Assert.check(node_1.Config.DAO.QUORUM.satisfy(this.turnout.v), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "turnout out of range"));
        error_1.Assert.check(node_1.Config.DAO.QUORUM.satisfy(this.quorum.v), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "quorum out of range"));
        this.whitelist.accounts.forEach(a => error_1.Assert.check(this.contract.toString() !== a.toString(), error_1.MitumError.detail(error_1.ECODE.INVALID_FACT, "contract is same with whitelist address")));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.option),
            this.votingPowerToken.toBuffer(),
            this.threshold.toBuffer(),
            this.fee.toBuffer(),
            this.whitelist.toBuffer(),
            this.proposalReviewPeriod.toBuffer("fill"),
            this.registrationPeriod.toBuffer("fill"),
            this.preSnapshotPeriod.toBuffer("fill"),
            this.votingPeriod.toBuffer("fill"),
            this.postSnapshotPeriod.toBuffer("fill"),
            this.executionDelayPeriod.toBuffer("fill"),
            this.turnout.toBuffer(),
            this.quorum.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { option: this.option, voting_power_token: this.votingPowerToken.toString(), threshold: this.threshold.toString(), fee: this.fee.toHintedObject(), whitelist: this.whitelist.toHintedObject(), proposal_review_period: this.proposalReviewPeriod.v, registration_period: this.registrationPeriod.v, pre_snapshot_period: this.preSnapshotPeriod.v, voting_period: this.votingPeriod.v, post_snapshot_period: this.postSnapshotPeriod.v, execution_delay_period: this.executionDelayPeriod.v, turnout: this.turnout.v, quorum: this.quorum.v });
    }
    get operationHint() {
        return alias_1.HINT.DAO.UPDATE_POLICY.OPERATION;
    }
}
exports.UpdatePolicyFact = UpdatePolicyFact;
//# sourceMappingURL=update-policy.js.map