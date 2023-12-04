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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const key_1 = require("../../key");
const types_1 = require("../../types");
const url = (api, contract) => `${types_1.IP.from(api).toString()}/sto/${key_1.Address.from(contract).toString()}`;
function getService(api, contract) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield axios_1.default.get(`${url(api, contract)}`);
    });
}
function getPartitions(api, contract, holder) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield axios_1.default.get(`${url(api, contract)}/holder/${key_1.Address.from(holder).toString()}/partitions`);
    });
}
function getBalanceByHolder(api, contract, holder, partition) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield axios_1.default.get(`${url(api, contract)}/holder/${key_1.Address.from(holder).toString()}/partition/${partition}/balance`);
    });
}
function getOperatorsByHolder(api, contract, holder, partition) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield axios_1.default.get(`${url(api, contract)}/holder/${key_1.Address.from(holder).toString()}/partition/${partition}/operators`);
    });
}
function getPartitionBalance(api, contract, partition) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield axios_1.default.get(`${url(api, contract)}/partition/${partition}/balance`);
    });
}
function getAuthorized(api, contract, operator) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield axios_1.default.get(`${url(api, contract)}/operator/${key_1.Address.from(operator).toString()}/holders`);
    });
}
exports.default = {
    getService,
    getPartitions,
    getBalanceByHolder,
    getOperatorsByHolder,
    getPartitionBalance,
    getAuthorized,
};
//# sourceMappingURL=sto.js.map