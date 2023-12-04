import { Currency, Account, Contract } from "./currency";
import { NFT } from "./nft";
import { Credential } from "./credential";
import { DAO } from "./dao";
import { STO } from "./sto";
import { KYC } from "./kyc";
import { TimeStamp } from "./timestamp";
import { Token } from "./token";
import { Point } from "./point";
import { Signer } from "./signer";
import { operation as api } from "../api";
import { KeyPair } from "../key";
import { Generator } from "../types";
import * as Base from "./base";
export class Operation extends Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    async getAllOperations() {
        return await api.getOperations(this.api);
    }
    async getOperation(hash) {
        return await api.getOperation(this.api, hash);
    }
    sign(privatekey, operation, option) {
        const op = operation;
        op.sign(privatekey instanceof KeyPair ? privatekey.privateKey : privatekey, option);
        return op;
    }
    async send(operation, headers) {
        return await api.send(this.api, operation, headers);
    }
}
export { Currency, Account, Contract, NFT, Credential, DAO, STO, KYC, TimeStamp, Token, Point, Signer, Base, };
//# sourceMappingURL=index.js.map