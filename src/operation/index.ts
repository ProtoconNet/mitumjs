import { SignOption, Operation as OP, Fact } from "./base"

import { Currency, Account, Contract } from "./currency"
import { NFT } from "./nft"
import { Credential } from "./credential"
import { DAO } from "./dao"
import { STO } from "./sto"
import { KYC } from "./kyc"
import { TimeStamp } from "./timestamp"
import { Token } from "./token"
import { Point } from "./point"
import { Signer } from "./signer"

import { operation as api } from "../api"
import { Key, KeyPair } from "../key"
import { Generator, HintedObject, IP } from "../types"
import { getAPIData } from "../api"
import { isOpFact } from "../utils/typeGuard"

import * as Base from "./base"

export class Operation extends Generator {
	constructor(
		networkID: string,
		api?: string | IP,
		delegateIP?: string | IP,
	) {
		super(networkID, api, delegateIP)
	}

	async getAllOperations() {
		return await getAPIData(() => api.getOperations(this.api, this.delegateIP))
	}


	async getOperation(hash: string) {
		return await getAPIData(() => api.getOperation(this.api, hash, this.delegateIP))
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
		operation: string | HintedObject | OP<Fact>,
		headers?: { [i: string]: any }
	) {
		const res = await getAPIData(() => 
		api.send(
			this.api,
			isOpFact(operation) 
			  ? operation.toHintedObject() 
			  : operation, 
			this.delegateIP, 
			headers
		  )
		);
        return res
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
	Point,
	Signer,
	Base,
}