"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAO = void 0;
const create_dao_1 = require("./create-dao");
const propose_1 = require("./propose");
const cancel_proposal_1 = require("./cancel-proposal");
const register_1 = require("./register");
const pre_snap_1 = require("./pre-snap");
const post_snap_1 = require("./post-snap");
const vote_1 = require("./vote");
const execute_1 = require("./execute");
const policy_1 = require("./policy");
const whitelist_1 = require("./whitelist");
const proposal_1 = require("./proposal");
const proposal_2 = require("./proposal");
const base_1 = require("../base");
const key_1 = require("../../key");
const common_1 = require("../../common");
const api_1 = require("../../api");
const types_1 = require("../../types");
const update_policy_1 = require("./update-policy");
const error_1 = require("../../error");
class DAO extends base_1.ContractGenerator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    createService(contractAddr, sender, data, currency) {
        const keysToCheck = ['option', 'token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            error_1.Assert.check(data[key] !== undefined, error_1.MitumError.detail(error_1.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the daoData structure`));
        });
        return new base_1.Operation(this.networkID, new create_dao_1.CreateDAOFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, data.option, data.token, data.threshold, new common_1.Amount(currency, data.fee), new whitelist_1.Whitelist(true, data.proposers.map(a => key_1.Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum, currency));
    }
    updateService(contractAddr, sender, data, currency) {
        const keysToCheck = ['option', 'token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            error_1.Assert.check(data[key] !== undefined, error_1.MitumError.detail(error_1.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the daoData structure`));
        });
        return new base_1.Operation(this.networkID, new update_policy_1.UpdatePolicyFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, data.option, data.token, data.threshold, new common_1.Amount(currency, data.fee), new whitelist_1.Whitelist(true, data.proposers.map(a => key_1.Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum, currency));
    }
    formTransferCalldata(sender, receiver, currency, amount) {
        return new proposal_2.TransferCalldata(sender, receiver, new common_1.Amount(currency, amount));
    }
    formSetPolicyCalldata(data, currency) {
        const keysToCheck = ['token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            error_1.Assert.check(data[key] !== undefined, error_1.MitumError.detail(error_1.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the policyData structure`));
        });
        return new proposal_2.GovernanceCalldata(new policy_1.DAOPolicy(data.token, data.threshold, new common_1.Amount(currency, data.fee), new whitelist_1.Whitelist(true, data.proposers.map(a => key_1.Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum));
    }
    writeCryptoProposal(proposer, startTime, calldata) {
        return new proposal_1.CryptoProposal(proposer, startTime, calldata);
    }
    writeBizProposal(proposer, startTime, url, hash, options) {
        return new proposal_1.BizProposal(proposer, startTime, url, hash, options);
    }
    propose(contractAddr, sender, proposalID, proposal, currency) {
        return new base_1.Operation(this.networkID, new propose_1.ProposeFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, proposalID, proposal, currency));
    }
    register(contractAddr, sender, proposalID, currency, delegator) {
        return new base_1.Operation(this.networkID, new register_1.RegisterFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, proposalID, delegator ? delegator : sender, currency));
    }
    cancel(contractAddr, sender, proposalID, currency) {
        return new base_1.Operation(this.networkID, new cancel_proposal_1.CancelProposalFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    snapBeforeVoting(contractAddr, sender, proposalID, currency) {
        return new base_1.Operation(this.networkID, new pre_snap_1.PreSnapFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    castVote(contractAddr, sender, proposalID, voteOption, currency) {
        return new base_1.Operation(this.networkID, new vote_1.VoteFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, proposalID, voteOption, currency));
    }
    snapAfterVoting(contractAddr, sender, proposalID, currency) {
        return new base_1.Operation(this.networkID, new post_snap_1.PostSnapFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    execute(contractAddr, sender, proposalID, currency) {
        return new base_1.Operation(this.networkID, new execute_1.ExecuteFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    getServiceInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.dao.getService(this.api, contractAddr));
        });
    }
    getProposalInfo(contractAddr, proposalID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.dao.getProposal(this.api, contractAddr, proposalID));
        });
    }
    getDelegatorInfo(contractAddr, proposalID, delegator) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.dao.getDelegator(this.api, contractAddr, proposalID, delegator));
        });
    }
    getVoterInfo(contractAddr, proposalID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.dao.getVoter(this.api, contractAddr, proposalID));
        });
    }
    getVotingResult(contractAddr, proposalID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.dao.getVotingResult(this.api, contractAddr, proposalID));
        });
    }
}
exports.DAO = DAO;
//# sourceMappingURL=index.js.map