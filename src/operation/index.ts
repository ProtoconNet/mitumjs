import { SignOption, Operation as OP, Fact } from "./base"

import { Currency, Account, Contract } from "./currency"
import { NFT } from "./nft"
import { Credential } from "./credential"
import { DAO } from "./dao"
import { STO } from "./sto"
import { KYC } from "./kyc"
import { TimeStamp } from "./timestamp"
import { Token } from "./token"
import { Signer } from "./signer"

import { operation as api } from "../api"
import { Key, KeyPair } from "../key"
import { Generator, HintedObject, IP } from "../types"

import * as Base from "./base"

export class Operation extends Generator {
	constructor(
		networkID: string,
		api?: string | IP,
	) {
		super(networkID, api)
	}

	async getAllOperations() {
		return await api.getOperations(this.api)
	}

	async getOperation(hash: string) {
		return await api.getOperation(this.api, hash)
	}

	sign(
		privatekey: string | Key | KeyPair,
		operation: OP<Fact>,
		option?: SignOption,
	) {
		const op = operation
		op.sign(privatekey instanceof KeyPair ? privatekey.privateKey : privatekey, option)
		return op
	}

	async send(
		operation: string | HintedObject,
		headers?: { [i: string]: any }
	) {
		return await api.send(this.api, operation, headers)
	}
}

export {
	Currency, Account, Contract,
	NFT,
	Credential,
	DAO,
	STO,
	KYC,
	TimeStamp,
	Token,
	Signer,
	Base,
}