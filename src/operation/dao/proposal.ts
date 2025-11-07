import { DAOPolicy } from "./policy"

import { HINT } from "../../alias"
import { Address } from "../../key/address"
import { Amount, Hint } from "../../common"
import { Big, HintedObject, IBuffer, IHintedObject, LongString } from "../../types"
import { Config } from "../../node"
import { Assert, ECODE, MitumError } from "../../error"

abstract class Calldata implements IBuffer, IHintedObject {
    private hint: Hint

    constructor(hint: string) {
        this.hint = new Hint(hint)
    }

    toBuffer(): Buffer {
        return Buffer.from([])
    }

    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString(),
        }
    }
}

export class TransferCalldata extends Calldata {
    readonly sender: Address
    readonly receiver: Address
    readonly amount: Amount

    constructor(sender: string | Address, receiver: string | Address, amount: Amount) {
        super(HINT.DAO.CALLDATA.TRANSFER)
        this.sender = Address.from(sender)
        this.receiver = Address.from(receiver)
        this.amount = amount
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            receiver: this.receiver.toString(),
            amount: this.amount.toHintedObject(),
        }
    }
}

export class GovernanceCalldata extends Calldata {
    readonly policy: DAOPolicy

    constructor(policy: DAOPolicy) {
        super(HINT.DAO.CALLDATA.GOVERNANCE)
        this.policy = policy
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.policy.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            policy: this.policy.toHintedObject(),
        }
    }
}

abstract class Proposal implements IBuffer, IHintedObject {
    private hint: Hint
    readonly proposer: Address
    readonly startTime: Big
    
    constructor(hint: string, proposer: string | Address, startTime: string | number | Big) {
        this.hint = new Hint(hint)
        this.proposer = Address.from(proposer)
        this.startTime = Big.from(startTime)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.proposer.toBuffer(),
            this.startTime.toBuffer("fill"),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString(),
            proposer: this.proposer.toString(),
            start_time: this.startTime.v,
        }
    }
}

export class CryptoProposal extends Proposal {
    readonly calldata: TransferCalldata | GovernanceCalldata

    constructor(proposer: string | Address, startTime: string | number | Big, calldata: TransferCalldata | GovernanceCalldata) {
        super(HINT.DAO.PROPOSAL.CRYPTO, proposer, startTime)
        this.calldata = calldata
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.calldata.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            call_data: this.calldata.toHintedObject(),
        }
    }
}

export class BizProposal extends Proposal {
    readonly url: LongString
    readonly hash: LongString
    readonly options: Big

    constructor(
        proposer: string | Address,
        startTime: string | number | Big,
        url: string | LongString,
        hash: string | LongString,
        options: string | number | Big,
    ) {
        super(HINT.DAO.PROPOSAL.BIZ, proposer, startTime)

        this.url = LongString.from(url)
        this.hash = LongString.from(hash)
        this.options = Big.from(options)

        Assert.check(
            Config.DAO.VOTE.satisfy(Number(this.options)),
            MitumError.detail(ECODE.INVALID_FACT, "vote option out of range"),    
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.url.toBuffer(),
            this.hash.toBuffer(),
            this.options.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            url: this.url.toString(),
            hash: this.hash.toString(),
            options: this.options.v,
        }
    }
}