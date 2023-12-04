import { CreateDAOFact } from "./create-dao";
import { ProposeFact } from "./propose";
import { CancelProposalFact } from "./cancel-proposal";
import { RegisterFact } from "./register";
import { PreSnapFact } from "./pre-snap";
import { PostSnapFact } from "./post-snap";
import { VoteFact } from "./vote";
import { ExecuteFact } from "./execute";
import { DAOPolicy } from "./policy";
import { Whitelist } from "./whitelist";
import { CryptoProposal, BizProposal } from "./proposal";
import { TransferCalldata, GovernanceCalldata } from "./proposal";
import { ContractGenerator, Operation } from "../base";
import { Address } from "../../key";
import { Amount } from "../../common";
import { contract, getAPIData } from "../../api";
import { TimeStamp } from "../../types";
import { UpdatePolicyFact } from "./update-policy";
import { Assert, ECODE, MitumError } from "../../error";
export class DAO extends ContractGenerator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    createService(contractAddr, sender, data, currency) {
        const keysToCheck = ['option', 'token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the daoData structure`));
        });
        return new Operation(this.networkID, new CreateDAOFact(TimeStamp.new().UTC(), sender, contractAddr, data.option, data.token, data.threshold, new Amount(currency, data.fee), new Whitelist(true, data.proposers.map(a => Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum, currency));
    }
    updateService(contractAddr, sender, data, currency) {
        const keysToCheck = ['option', 'token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the daoData structure`));
        });
        return new Operation(this.networkID, new UpdatePolicyFact(TimeStamp.new().UTC(), sender, contractAddr, data.option, data.token, data.threshold, new Amount(currency, data.fee), new Whitelist(true, data.proposers.map(a => Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum, currency));
    }
    formTransferCalldata(sender, receiver, currency, amount) {
        return new TransferCalldata(sender, receiver, new Amount(currency, amount));
    }
    formSetPolicyCalldata(data, currency) {
        const keysToCheck = ['token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the policyData structure`));
        });
        return new GovernanceCalldata(new DAOPolicy(data.token, data.threshold, new Amount(currency, data.fee), new Whitelist(true, data.proposers.map(a => Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum));
    }
    writeCryptoProposal(proposer, startTime, calldata) {
        return new CryptoProposal(proposer, startTime, calldata);
    }
    writeBizProposal(proposer, startTime, url, hash, options) {
        return new BizProposal(proposer, startTime, url, hash, options);
    }
    propose(contractAddr, sender, proposalID, proposal, currency) {
        return new Operation(this.networkID, new ProposeFact(TimeStamp.new().UTC(), sender, contractAddr, proposalID, proposal, currency));
    }
    register(contractAddr, sender, proposalID, currency, delegator) {
        return new Operation(this.networkID, new RegisterFact(TimeStamp.new().UTC(), sender, contractAddr, proposalID, delegator ? delegator : sender, currency));
    }
    cancel(contractAddr, sender, proposalID, currency) {
        return new Operation(this.networkID, new CancelProposalFact(TimeStamp.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    snapBeforeVoting(contractAddr, sender, proposalID, currency) {
        return new Operation(this.networkID, new PreSnapFact(TimeStamp.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    castVote(contractAddr, sender, proposalID, voteOption, currency) {
        return new Operation(this.networkID, new VoteFact(TimeStamp.new().UTC(), sender, contractAddr, proposalID, voteOption, currency));
    }
    snapAfterVoting(contractAddr, sender, proposalID, currency) {
        return new Operation(this.networkID, new PostSnapFact(TimeStamp.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    execute(contractAddr, sender, proposalID, currency) {
        return new Operation(this.networkID, new ExecuteFact(TimeStamp.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    async getServiceInfo(contractAddr) {
        return await getAPIData(() => contract.dao.getService(this.api, contractAddr));
    }
    async getProposalInfo(contractAddr, proposalID) {
        return await getAPIData(() => contract.dao.getProposal(this.api, contractAddr, proposalID));
    }
    async getDelegatorInfo(contractAddr, proposalID, delegator) {
        return await getAPIData(() => contract.dao.getDelegator(this.api, contractAddr, proposalID, delegator));
    }
    async getVoterInfo(contractAddr, proposalID) {
        return await getAPIData(() => contract.dao.getVoter(this.api, contractAddr, proposalID));
    }
    async getVotingResult(contractAddr, proposalID) {
        return await getAPIData(() => contract.dao.getVotingResult(this.api, contractAddr, proposalID));
    }
}
//# sourceMappingURL=index.js.map