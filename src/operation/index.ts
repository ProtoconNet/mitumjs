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
import { ErrorResponse } from "../types"
import { getAPIData } from "../api"
import { isOpFact } from "../utils/typeGuard"

import { delegateUri } from "../utils"

import * as Base from "./base"

export class Operation extends Generator {
	constructor(
		networkID: string,
		api?: string | IP,
		delegateIP?: string | IP,
	) {
		super(networkID, api, delegateIP)
	}

	async getAllOperations(limit?: number, offset?: [number, number], reverse?: true) {
		return await getAPIData(() => api.getOperations(this.api, this.delegateIP, limit, offset, reverse))
	}

	async getOperation(hash: string) {
		const response = await getAPIData(() => api.getOperation(this.api, hash, this.delegateIP));
		response.data = response.data ? response.data : null;
		return response
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
	): Promise<OperationResponse> {
		const sendResponse = await getAPIData(() => 
		api.send(
			this.api,
			isOpFact(operation) 
			  ? operation.toHintedObject() 
			  : operation, 
			this.delegateIP, 
			headers
		  )
		);

		return new OperationResponse(sendResponse, this.api, this.delegateIP)
	}
}

export class OperationResponse {
    readonly response: any;
    private _api: string | IP;
    private _delegateIP: string | IP;

    constructor(response: string, api: string | IP, delegateIP: string | IP) {
        this.response = response;
        this._api = api;
        this._delegateIP = delegateIP;
    }

    async wait(timeout?: number, interval?: number) : Promise<any> {
		if (this.response.status !== 200) { throw new Error("Failed to send operation") }

        let elapsedTime = 0;
		const maxTimeout = timeout ?? 10000;
		const timeoutInterval = interval ?? 1000;

		const validatePositiveInteger = (val: any, name: string) => {
			if (!Number.isSafeInteger(val) || val <= 0) {
				throw new Error(`${name} must be a positive integer`)
			}
		}
		validatePositiveInteger(maxTimeout, "timeout");
		validatePositiveInteger(timeoutInterval, "interval");
	
		if (maxTimeout <= timeoutInterval) {
			if (interval === undefined) {
				throw new Error("default interval is 1000, so timeout must be greater than that.");
			} else if (timeout === undefined) {
				throw new Error("default timeout is 10000, so interval must be less than that.");
			} else {
				throw new Error("timeout must be larger than interval.");
			}
		}

		let stop = false;
        while (!stop && elapsedTime < maxTimeout) {
            try {
                const receipt = await getAPIData(() => api.getOperation(this._api, this.response.data.fact.hash, this._delegateIP));
                if (receipt.data) {
					if (receipt.data.in_state) {
						console.log('\x1b[34m%s\x1b[0m', `operation in_state is true`)
						return receipt;
					} else {
						console.log('\x1b[31m%s\x1b[0m', `operation in_state is false. reason: ${receipt.data.reason}`);
						return receipt;
					}
				} else {
                    console.log('\x1b[33m%s\x1b[0m', "polling...");
                }
            } catch (error: any) {
				stop = true;
				throw(error);
            }
            elapsedTime += timeoutInterval;
            await new Promise(resolve => setTimeout(resolve, timeoutInterval));
        }
		if (!stop) {
			const apiPath = `${IP.from(this._api).toString()}/block/operation/${this.response.data.fact.hash}`;
			const parsedError: ErrorResponse = {
				// 없는 factHash도 조회시 200번 응답이 나오기때문에 status를 뭐라고 하기 애매함.
				status: undefined,
				method: 'get',
				url: !this._delegateIP ? apiPath : delegateUri(this._delegateIP) + encodeURIComponent(apiPath),
				error_code: [],
				request_body: undefined,
				error_message: `timeout reached (${maxTimeout/1000} seconds).`,
			};
			return parsedError;
		}
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