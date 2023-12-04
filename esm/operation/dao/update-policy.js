import { ContractFact } from "../base";
import { Big } from "../../types";
import { HINT } from "../../alias";
import { Config } from "../../node";
import { CurrencyID } from "../../common";
import { Assert, ECODE, MitumError } from "../../error";
export class UpdatePolicyFact extends ContractFact {
    option;
    votingPowerToken;
    threshold;
    fee;
    whitelist;
    proposalReviewPeriod;
    registrationPeriod;
    preSnapshotPeriod;
    votingPeriod;
    postSnapshotPeriod;
    executionDelayPeriod;
    turnout;
    quorum;
    constructor(token, sender, contract, option, votingPowerToken, threshold, fee, whitelist, proposalReviewPeriod, registrationPeriod, preSnapshotPeriod, votingPeriod, postSnapshotPeriod, executionDelayPeriod, turnout, quorum, currency) {
        super(HINT.DAO.UPDATE_POLICY.FACT, token, sender, contract, currency);
        this.option = option;
        this.votingPowerToken = CurrencyID.from(votingPowerToken);
        this.threshold = Big.from(threshold);
        this.fee = fee;
        this.whitelist = whitelist;
        this.proposalReviewPeriod = Big.from(proposalReviewPeriod);
        this.registrationPeriod = Big.from(registrationPeriod);
        this.preSnapshotPeriod = Big.from(preSnapshotPeriod);
        this.votingPeriod = Big.from(votingPeriod);
        this.postSnapshotPeriod = Big.from(postSnapshotPeriod);
        this.executionDelayPeriod = Big.from(executionDelayPeriod);
        this.turnout = Big.from(turnout);
        this.quorum = Big.from(quorum);
        Assert.check(Config.DAO.QUORUM.satisfy(this.turnout.v), MitumError.detail(ECODE.INVALID_FACT, "turnout out of range"));
        Assert.check(Config.DAO.QUORUM.satisfy(this.quorum.v), MitumError.detail(ECODE.INVALID_FACT, "quorum out of range"));
        this.whitelist.accounts.forEach(a => Assert.check(this.contract.toString() !== a.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with whitelist address")));
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
        return {
            ...super.toHintedObject(),
            option: this.option,
            voting_power_token: this.votingPowerToken.toString(),
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
    get operationHint() {
        return HINT.DAO.UPDATE_POLICY.OPERATION;
    }
}
//# sourceMappingURL=update-policy.js.map