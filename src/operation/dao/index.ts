import { CreateDAOFact } from "./create-dao"
import { ProposeFact } from "./propose"
import { CancelProposalFact } from "./cancel-proposal"
import { RegisterFact } from "./register"
import { PreSnapFact } from "./pre-snap"
import { PostSnapFact } from "./post-snap"
import { VoteFact } from "./vote"
import { ExecuteFact } from "./execute"

import { DAOPolicy } from "./policy"
import { Whitelist } from "./whitelist"
import { CryptoProposal, BizProposal } from "./proposal"
import { TransferCalldata, GovernanceCalldata } from "./proposal"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { Amount, CurrencyID } from "../../common"
import { contract, getAPIData } from "../../api"
import { Big, IP, LongString, TimeStamp, URIString } from "../../types"
import { UpdatePolicyFact } from "./update-policy"
import { Assert, ECODE, MitumError } from "../../error"

type policyData = {
    token: string | CurrencyID,
    threshold: string | number | Big,
    fee: string | number | Big,
    proposers: (string | Address)[],
    proposalReviewPeriod: string | number | Big,
    registrationPeriod: string | number | Big,
    preSnapshotPeriod: string | number | Big,
    votingPeriod: string | number | Big,
    postSnapshotPeriod: string | number | Big,
    executionDelayPeriod: string | number | Big,
    turnout: string | number | Big,
    quorum: string | number | Big,
}

type daoData = policyData & {
    option: "crypto" | "biz"
}

export class DAO extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }

    createService(
        contractAddr: string | Address,
        sender: string | Address,
        data: daoData,
        currency: string | CurrencyID,
    ) {
        const keysToCheck: (keyof daoData)[] = ['option', 'token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the daoData structure`))
        });
        return new Operation(
            this.networkID,
            new CreateDAOFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                data.option,
                data.token,
                data.threshold,
                new Amount(currency, data.fee),
                new Whitelist(true, data.proposers.map(a => Address.from(a))),
                data.proposalReviewPeriod,
                data.registrationPeriod,
                data.preSnapshotPeriod,
                data.votingPeriod,
                data.postSnapshotPeriod,
                data.executionDelayPeriod,
                data.turnout,
                data.quorum,
                currency,
            )
        )
    }

    updateService(
        contractAddr: string | Address,
        sender: string | Address,
        data: daoData,
        currency: string | CurrencyID,
    ) {
        const keysToCheck: (keyof daoData)[] = ['option', 'token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the daoData structure`))
        });
        return new Operation(
            this.networkID,
            new UpdatePolicyFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                data.option,
                data.token,
                data.threshold,
                new Amount(currency, data.fee),
                new Whitelist(true, data.proposers.map(a => Address.from(a))),
                data.proposalReviewPeriod,
                data.registrationPeriod,
                data.preSnapshotPeriod,
                data.votingPeriod,
                data.postSnapshotPeriod,
                data.executionDelayPeriod,
                data.turnout,
                data.quorum,
                currency,
            )
        )
    }

    formTransferCalldata(
        sender: string | Address,
        receiver: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ): TransferCalldata {
        return new TransferCalldata(sender, receiver, new Amount(currency, amount))
    }

    formSetPolicyCalldata(
        data: policyData,
        currency: string | CurrencyID,
    ): GovernanceCalldata {
        const keysToCheck: (keyof policyData)[] = ['token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the policyData structure`))
        });
        return new GovernanceCalldata(
            new DAOPolicy(
                data.token,
                data.threshold,
                new Amount(currency, data.fee),
                new Whitelist(true, data.proposers.map(a => Address.from(a))),
                data.proposalReviewPeriod,
                data.registrationPeriod,
                data.preSnapshotPeriod,
                data.votingPeriod,
                data.postSnapshotPeriod,
                data.executionDelayPeriod,
                data.turnout,
                data.quorum,
            )
        )
    }

    writeCryptoProposal(proposer: string, startTime: number, calldata: TransferCalldata | GovernanceCalldata) {
        return new CryptoProposal(proposer, startTime, calldata)
    }

    writeBizProposal(
        proposer: string | Address,
        startTime: string | number | Big,
        url: string | LongString,
        hash: string | LongString,
        options: string | number | Big,
    ) {
        return new BizProposal(proposer, startTime, url, hash, options);
    }

    propose(
        contractAddr: string | Address,
        sender: string | Address,
        proposalID: string,
        proposal: CryptoProposal | BizProposal,
        currency: string | CurrencyID,
    ) {
        new URIString(proposalID, 'proposalID');
        return new Operation(
            this.networkID,
            new ProposeFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                proposalID,
                proposal,
                currency
            )
        )
    }

    register(
        contractAddr: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
        delegator?: string | Address,
    ) {
        return new Operation(
            this.networkID,
            new RegisterFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                proposalID,
                delegator ? delegator : sender,
                currency,
            )
        )
    }

    cancel(
        contractAddr: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new CancelProposalFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                proposalID,
                currency
            )
        )
    }

    snapBeforeVoting(
        contractAddr: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new PreSnapFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                proposalID,
                currency
            )
        )
    }

    castVote(
        contractAddr: string | Address,
        sender: string | Address,
        proposalID: string,
        voteOption: number,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new VoteFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                proposalID,
                voteOption,
                currency
            )
        )
    }

    snapAfterVoting(
        contractAddr: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new PostSnapFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                proposalID,
                currency
            )
        )
    }

    execute(
        contractAddr: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new ExecuteFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                proposalID,
                currency
            )
        )
    }

    async getServiceInfo(contractAddr: string | Address) {
        return await getAPIData(() => contract.dao.getService(this.api, contractAddr))
    }

    async getProposalInfo(contractAddr: string | Address, proposalID: string) {
        return await getAPIData(() => contract.dao.getProposal(this.api, contractAddr, proposalID))
    }

    async getDelegatorInfo(contractAddr: string | Address, proposalID: string, delegator: string | Address) {
        return await getAPIData(() => contract.dao.getDelegator(this.api, contractAddr, proposalID, delegator))
    }

    async getVoterInfo(contractAddr: string | Address, proposalID: string) {
        return await getAPIData(() => contract.dao.getVoter(this.api, contractAddr, proposalID))
    }

    async getVotingResult(contractAddr: string | Address, proposalID: string) {
        return await getAPIData(() => contract.dao.getVotingResult(this.api, contractAddr, proposalID))
    }
}