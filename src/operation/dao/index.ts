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
import { Amount, Fee, CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
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
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }
    
    /**
     * Generate `create-dao` operation for creating a new DAO on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {daoData} [data] - Data for policy of DAO service to create. The properties of `daoData` include:
     * - {'crypto' | 'biz'} `option` - Option indicates the type of proposal to be registered.
     * - {string | CurrencyID} `token` - The currency ID to be used when calculating voting power.
     * - {string | number | Big} `threshold` - The minimum balance of a proposer must hold.
     * - {string | number | Big} `fee` - The fee paid when registering a proposal.
     * - {(string | Address)[]} `proposers` - An array of addresses for accounts who can propose the new proposals.
     * - {string | number | Big} `proposalReviewPeriod` - The duration of the proposal review period (in seconds).
     * - {string | number | Big} `registrationPeriod` - The duration of the registration period (in seconds).
     * - {string | number | Big} `preSnapshotPeriod` - The duration of the pre-snapshot period (in seconds).
     * - {string | number | Big} `votingPeriod` - The duration of the voting period (in seconds).
     * - {string | number | Big} `postSnapshotPeriod` - The duration of the post-snapshot period (in seconds).
     * - {string | number | Big} `executionDelayPeriod` - The duration of the execution delay period (in seconds).
     * - {string | number | Big} `turnout` - The minimum rate of attendees for a proposal to pass (in percentage)
     * - {string | number | Big} `quorum` - The minimum rate of upvotes for a proposal to pass (in percentage)
     * @param {string | CurrencyID} currency - The currency ID.
     * @returns `create-dao` operation.
     */
    createService(
        contract: string | Address,
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
                contract,
                data.option,
                new DAOPolicy(
                    data.token,
                    data.threshold,
                    new Fee(currency, data.fee),
                    new Whitelist(true, data.proposers.map(a => Address.from(a))),
                    data.proposalReviewPeriod,
                    data.registrationPeriod,
                    data.preSnapshotPeriod,
                    data.votingPeriod,
                    data.postSnapshotPeriod,
                    data.executionDelayPeriod,
                    data.turnout,
                    data.quorum,
                ),
                currency,
            )
        )
    }
    
    /**
     * Generate `update-policy` operation for updating the DAO policy on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {daoData} [data] - Data for policy of DAO service to update. The properties of `daoData` include:
     * - {'crypto' | 'biz'} `option` - Option indicates the type of proposal to be registered.
     * - {string | CurrencyID} `token` - The currency ID to be used when calculating voting power.
     * - {string | number | Big} `threshold` - The minimum balance of a proposer must hold.
     * - {string | number | Big} `fee` - The fee paid when registering a proposal.
     * - {(string | Address)[]} `proposers` - An array of addresses for accounts who can propose the new proposals.
     * - {string | number | Big} `proposalReviewPeriod` - The duration of the proposal review period (in seconds).
     * - {string | number | Big} `registrationPeriod` - The duration of the registration period (in seconds).
     * - {string | number | Big} `preSnapshotPeriod` - The duration of the pre-snapshot period (in seconds).
     * - {string | number | Big} `votingPeriod` - The duration of the voting period (in seconds).
     * - {string | number | Big} `postSnapshotPeriod` - The duration of the post-snapshot period (in seconds).
     * - {string | number | Big} `executionDelayPeriod` - The duration of the execution delay period (in seconds).
     * - {string | number | Big} `turnout` - The minimum rate of attendees for a proposal to pass (in percentage)
     * - {string | number | Big} `quorum` - The minimum rate of upvotes for a proposal to pass (in percentage)
     * @param {string | CurrencyID} currency - The currency ID.
     * @returns `update-policy` operation
     */
    updateService(
        contract: string | Address,
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
                contract,
                data.option,
                new DAOPolicy(
                    data.token,
                    data.threshold,
                    new Fee(currency, data.fee),
                    new Whitelist(true, data.proposers.map(a => Address.from(a))),
                    data.proposalReviewPeriod,
                    data.registrationPeriod,
                    data.preSnapshotPeriod,
                    data.votingPeriod,
                    data.postSnapshotPeriod,
                    data.executionDelayPeriod,
                    data.turnout,
                    data.quorum,
                ),
                currency,
            )
        )
    }
    
    /**
     * Create transfer calldata for the crypto proposal to transfer crypto currency.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The amount to transfer.
     * @returns Transfer calldata.
     */
    formTransferCalldata(
        sender: string | Address,
        receiver: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ): TransferCalldata {
        return new TransferCalldata(sender, receiver, new Amount(currency, amount))
    }
    
    /**
     * Create governance calldata for the crypto proposal to update DAO policy.
     * @param {policyData} [data] - Data for policy of DAO service to update. The properties of `policyData` include:
     * - {string | CurrencyID} `token` - The currency ID to be used when calculating voting power.
     * - {string | number | Big} `threshold` - The minimum balance of a proposer must hold.
     * - {string | number | Big} `fee` - The fee paid when registering a proposal.
     * - {(string | Address)[]} `proposers` - An array of addresses for accounts who can propose the new proposals.
     * - {string | number | Big} `proposalReviewPeriod` - The duration of the proposal review period (in seconds).
     * - {string | number | Big} `registrationPeriod` - The duration of the registration period (in seconds).
     * - {string | number | Big} `preSnapshotPeriod` - The duration of the pre-snapshot period (in seconds).
     * - {string | number | Big} `votingPeriod` - The duration of the voting period (in seconds).
     * - {string | number | Big} `postSnapshotPeriod` - The duration of the post-snapshot period (in seconds).
     * - {string | number | Big} `executionDelayPeriod` - The duration of the execution delay period (in seconds).
     * - {string | number | Big} `turnout` - The minimum rate of attendees for a proposal to pass (in percentage)
     * - {string | number | Big} `quorum` - The minimum rate of upvotes for a proposal to pass (in percentage)
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns governance calldata.
     */
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
                new Fee(currency, data.fee),
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
    
    /**
     * Write a crypto proposal include `TransferCalldata` or `GovernanceCalldata` .
     * @param {string} [proposer] - The address of the proposer.
     * @param {number} [startTime] - The time to start `proposalReviewPeriod` (in UTC timestamp).
     * @param {TransferCalldata | GovernanceCalldata} [calldata] - Calldata for the crypto proposal.
     * @returns Crypto proposal to be proposed.
     */
    writeCryptoProposal(proposer: string, startTime: number, calldata: TransferCalldata | GovernanceCalldata) {
        return new CryptoProposal(proposer, startTime, calldata)
    }
    
    /**
     * Write a business proposal providing multiple choice voting.
     * @param {string | Address} [proposer] - The address of the proposer.
     * @param {string | number | Big} [startTime] - The time to start `proposalReviewPeriod` (in UTC timestamp).
     * @param {string | LongString} [url] - The URL associated with the proposal.
     * @param {string | LongString} [hash] - The hash associated with the proposal.
     * @param {string | number | Big} [options] - The number of multiple choices.
     * @returns Business proposal to be proposed.
     */
    writeBizProposal(
        proposer: string | Address,
        startTime: string | number | Big,
        url: string | LongString,
        hash: string | LongString,
        options: string | number | Big,
    ) {
        return new BizProposal(proposer, startTime, url, hash, options);
    }
    
    /**
     * Generate `propose` operation for propose a new proposal. Only the account in the whitelist can propose.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The unique identifier for the proposal.
     * @param {CryptoProposal | BizProposal} [proposal] - The proposal written by `writeBizProposal` or `writeCryptoProposal`.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `propose` operation.
     */
    propose(
        contract: string | Address,
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
                contract,
                proposalID,
                proposal,
                currency
            )
        )
    }
    
    /**
     * Generate `register` operation to register to get voting right to the proposal. If delegator is given, delegate voting rights.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The proposal ID.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [delegator] - (Optional) The address of the delegator.
     * @returns `register` operation
     */
    register(
        contract: string | Address,
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
                contract,
                proposalID,
                delegator ? delegator : sender,
                currency,
            )
        )
    }
    
    /**
     * Generate `cancel-proposal` operation to cancel a DAO proposal.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The unique identifier for the proposal.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `cancel-proposal` operation
     */
    cancel(
        contract: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new CancelProposalFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                proposalID,
                currency
            )
        )
    }
    
    /**
     * Generate `pre-snap` operation to take a snapshot before the voting period.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The proposal ID.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `pre-snap` operation.
     */
    snapBeforeVoting(
        contract: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new PreSnapFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                proposalID,
                currency
            )
        )
    }
    
    /**
     * Generate `vote` operation to cast a vote for the proposal.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The proposal ID.
     * @param {number} [voteOption] - The option chosen for the vote. (crypto: 0-approve, 1-disapprove, biz: choose from multiple choices)
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `vote` operation.
     */
    castVote(
        contract: string | Address,
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
                contract,
                proposalID,
                voteOption,
                currency
            )
        )
    }
    
    /**
     * Generate `post-snap` operation to take a snapshot after the voting period.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The proposal ID.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `post-snap` operation
     */
    snapAfterVoting(
        contract: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new PostSnapFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                proposalID,
                currency
            )
        )
    }
    
    /**
     * Generate `execute` operation to reflect voting results.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The proposal ID.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `execute` operation
     */
    execute(
        contract: string | Address,
        sender: string | Address,
        proposalID: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new ExecuteFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                proposalID,
                currency
            )
        )
    }
    
    /**
     * Get DAO service information for a specific contract address.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information of the DAO service:
     * - `_hint`: Hint for dao design,
     * - `option`: 'biz' or 'crypto',
     * - `policy`: [Policy]
     */
    async getServiceInfo(contract: string | Address) {
        Address.from(contract);
        return await getAPIData(() => contractApi.dao.getService(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get information about a specific DAO proposal. The `status` does not accurately reflect the current state of the proposal because it is updated only when an operation occurs.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [proposalID] - The proposal ID.
     * @returns `data` of `SuccessResponse` is information about the DAO proposal:
     * - `_hint`: Hint for the dao proposal state value,
     * - `status`: Proposal status - Proposed (0), Canceled (1), PreSnapped (2), PostSnapped (3), Completed (4), Rejected (5), Executed (6), NilStatus (7),
     * - `proposal`: [BizProposal] or [CryptoProposal],
     * - `policy`: [Policy]
     */
    async getProposalInfo(contract: string | Address, proposalID: string) {
        Address.from(contract);
        new URIString(proposalID, 'proposalID');
        return await getAPIData(() => contractApi.dao.getProposal(this.api, contract, proposalID,this.delegateIP))
    }
    
    /**
     * Get information about a specific delegator in a DAO proposal.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [proposalID] - The proposal ID.
     * @param {string | Address} [delegator] - The address of the delegator.
     * @returns `data` of `SuccessResponse` is delegator information:
     * - `_hint`: Hint for dao delegator info,
     * - `account`: Address of delegator account,
     * - `delegatee`: Address of delegatee account,
     */
    async getDelegatorInfo(contract: string | Address, proposalID: string, delegator: string | Address) {
        Address.from(contract);
        new URIString(proposalID, 'proposalID');
        return await getAPIData(() => contractApi.dao.getDelegator(this.api, contract, proposalID, delegator, this.delegateIP))
    }
    
    /**
     * Get information about voters in a specific DAO proposal.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [proposalID] - The proposal ID.
     * @returns `data` of `SuccessResponse` is an array of information of the voters:
     * - `_hint`: Hint for dao voter,
     * - `account`: Address of the voter,
     * - `delegators`: [ Address of delegatee, Address of delegator ]
     */
    async getVoterInfo(contract: string | Address, proposalID: string) {
        Address.from(contract);
        new URIString(proposalID, 'proposalID');
        return await getAPIData(() => contractApi.dao.getVoter(this.api, contract, proposalID, this.delegateIP))
    }
    
    /**
     * Get the voting result of a specific DAO proposal.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [proposalID] - The proposal ID.
     * @returns `data` of `SuccessResponse` is information of voting power and the voting result:
     * - `_hint`: Hint for voting power box.
     * - `total`: Total voting power.
     * - `voting_powers`: Object mapping registered account addresses to their corresponding voting information represents `_hint`, `account`,`voted`, `vote_for`, `voting_power`.
     * - `result`: Object consisting of the selected option and the number of votes.
     */
    async getVotingResult(contract: string | Address, proposalID: string) {
        Address.from(contract);
        new URIString(proposalID, 'proposalID');
        return await getAPIData(() => contractApi.dao.getVotingResult(this.api, contract, proposalID, this.delegateIP))
    }
}