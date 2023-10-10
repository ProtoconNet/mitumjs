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
import { Big, HintedObject, IP, LongString, TimeStamp } from "../../types"
import { UpdatePolicyFact } from "./update-policy"

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
        contractAdd: string | Address,
        sender: string | Address,
        data: daoData,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new CreateDAOFact(
                TimeStamp.new().UTC(),
                sender,
                contractAdd,
                data.option,
                data.token,
                data.threshold,
                data.fee,
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

    update(
        contractAdd: string | Address,
        sender: string | Address,
        data: daoData,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new UpdatePolicyFact(
                TimeStamp.new().UTC(),
                sender,
                contractAdd,
                data.option,
                data.token,
                data.threshold,
                data.fee,
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
    ): HintedObject {
        return new TransferCalldata(sender, receiver, new Amount(currency, amount))
    }

    formSetPolicyCalldata(data: policyData): HintedObject {
        return new GovernanceCalldata(
            new DAOPolicy(
                data.token,
                data.threshold,
                data.fee,
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
        contractAdd: string | Address,
        sender: string | Address,
        proposalID: string,
        proposal: CryptoProposal | BizProposal,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new ProposeFact(
                TimeStamp.new().UTC(),
                sender,
                contractAdd,
                proposalID,
                proposal,
                currency
            )
        )
    }

    register(
        contractAdd: string | Address,
        sender: string | Address,
        proposalID: string,
        delegator: string | Address,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RegisterFact(
                TimeStamp.new().UTC(),
                sender,
                contractAdd,
                proposalID,
                delegator,
                currency,
            )
        )
    }

    cancel(
        contractAdd: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new CancelProposalFact(
                TimeStamp.new().UTC(),
                sender,
                contractAdd,
                proposalID,
                currency
            )
        )
    }

    snapBeforeVoting(
        contractAdd: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new PreSnapFact(
                TimeStamp.new().UTC(),
                sender,
                contractAdd,
                proposalID,
                currency
            )
        )
    }

    castVote(
        contractAdd: string | Address,
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
                contractAdd,
                proposalID,
                voteOption,
                currency
            )
        )
    }

    snapAfterVoting(
        contractAdd: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new PostSnapFact(
                TimeStamp.new().UTC(),
                sender,
                contractAdd,
                proposalID,
                currency
            )
        )
    }

    execute(
        contractAdd: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new ExecuteFact(
                TimeStamp.new().UTC(),
                sender,
                contractAdd,
                proposalID,
                currency
            )
        )
    }

    async getServiceInfo(contractAdd: string | Address) {
        return await getAPIData(() => contract.dao.getService(this.api, contractAdd))
    }

    async getProposalInfo(contractAdd: string | Address, proposalID: string) {
        return await getAPIData(() => contract.dao.getProposal(this.api, contractAdd, proposalID))
    }

    async getDelegatorInfo(contractAdd: string | Address, proposalID: string, delegator: string | Address) {
        return await getAPIData(() => contract.dao.getDelegator(this.api, contractAdd, proposalID, delegator))
    }

    async getVoterInfo(contractAdd: string | Address, proposalID: string, voter: string | Address) {
        return await getAPIData(() => contract.dao.getVoter(this.api, contractAdd, proposalID, voter))
    }

    async getVotingResult(contractAdd: string | Address, proposalID: string) {
        return await getAPIData(() => contract.dao.getVotingResult(this.api, contractAdd, proposalID))
    }
}