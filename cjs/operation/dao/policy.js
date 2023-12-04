"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAOPolicy = void 0;
const alias_1 = require("../../alias");
const common_1 = require("../../common");
const types_1 = require("../../types");
class DAOPolicy {
    constructor(token, threshold, fee, whitelist, proposalReviewPeriod, registrationPeriod, preSnapshotPeriod, votingPeriod, postSnapshotPeriod, executionDelayPeriod, turnout, quorum) {
        this.hint = new common_1.Hint(alias_1.HINT.DAO.POLICY);
        this.token = common_1.CurrencyID.from(token);
        this.threshold = types_1.Big.from(threshold);
        this.fee = fee,
            this.whitelist = whitelist;
        this.proposalReviewPeriod = types_1.Big.from(proposalReviewPeriod);
        this.registrationPeriod = types_1.Big.from(registrationPeriod);
        this.preSnapshotPeriod = types_1.Big.from(preSnapshotPeriod);
        this.votingPeriod = types_1.Big.from(votingPeriod);
        this.postSnapshotPeriod = types_1.Big.from(postSnapshotPeriod);
        this.executionDelayPeriod = types_1.Big.from(executionDelayPeriod);
        this.turnout = types_1.Big.from(turnout);
        this.quorum = types_1.Big.from(quorum);
    }
    toBuffer() {
        return Buffer.concat([
            this.token.toBuffer(),
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
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            token: this.token.toString(),
            threshold: this.threshold.toString(),
            fee: this.fee.toHintedObject(),
            whitelist: this.whitelist.toHintedObject(),
            proposal_review_period: this.proposalReviewPeriod.v,
            registration_period: this.registrationPeriod.v,
            pre_snapshot_period: this.preSnapshotPeriod.v,
            voting_period: this.votingPeriod.v,
            post_snapshot_period: this.postSnapshotPeriod.v,
            execution_delay_period: this.executionDelayPeriod.v,
            turnout: this.turnout.v,
            quorum: this.quorum.v,
        };
    }
}
exports.DAOPolicy = DAOPolicy;
//# sourceMappingURL=policy.js.map