"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Base = exports.Signer = exports.Point = exports.Token = exports.TimeStamp = exports.KYC = exports.STO = exports.DAO = exports.Credential = exports.NFT = exports.Contract = exports.Account = exports.Currency = exports.Operation = void 0;
const currency_1 = require("./currency");
Object.defineProperty(exports, "Currency", { enumerable: true, get: function () { return currency_1.Currency; } });
Object.defineProperty(exports, "Account", { enumerable: true, get: function () { return currency_1.Account; } });
Object.defineProperty(exports, "Contract", { enumerable: true, get: function () { return currency_1.Contract; } });
const nft_1 = require("./nft");
Object.defineProperty(exports, "NFT", { enumerable: true, get: function () { return nft_1.NFT; } });
const credential_1 = require("./credential");
Object.defineProperty(exports, "Credential", { enumerable: true, get: function () { return credential_1.Credential; } });
const dao_1 = require("./dao");
Object.defineProperty(exports, "DAO", { enumerable: true, get: function () { return dao_1.DAO; } });
const sto_1 = require("./sto");
Object.defineProperty(exports, "STO", { enumerable: true, get: function () { return sto_1.STO; } });
const kyc_1 = require("./kyc");
Object.defineProperty(exports, "KYC", { enumerable: true, get: function () { return kyc_1.KYC; } });
const timestamp_1 = require("./timestamp");
Object.defineProperty(exports, "TimeStamp", { enumerable: true, get: function () { return timestamp_1.TimeStamp; } });
const token_1 = require("./token");
Object.defineProperty(exports, "Token", { enumerable: true, get: function () { return token_1.Token; } });
const point_1 = require("./point");
Object.defineProperty(exports, "Point", { enumerable: true, get: function () { return point_1.Point; } });
const signer_1 = require("./signer");
Object.defineProperty(exports, "Signer", { enumerable: true, get: function () { return signer_1.Signer; } });
const api_1 = require("../api");
const key_1 = require("../key");
const types_1 = require("../types");
const Base = __importStar(require("./base"));
exports.Base = Base;
class Operation extends types_1.Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    getAllOperations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield api_1.operation.getOperations(this.api);
        });
    }
    getOperation(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield api_1.operation.getOperation(this.api, hash);
        });
    }
    sign(privatekey, operation, option) {
        const op = operation;
        op.sign(privatekey instanceof key_1.KeyPair ? privatekey.privateKey : privatekey, option);
        return op;
    }
    send(operation, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield api_1.operation.send(this.api, operation, headers);
        });
    }
}
exports.Operation = Operation;
//# sourceMappingURL=index.js.map