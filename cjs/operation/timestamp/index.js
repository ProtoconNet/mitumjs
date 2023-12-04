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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeStamp = void 0;
const create_service_1 = require("./create-service");
const append_1 = require("./append");
const base_1 = require("../base");
const api_1 = require("../../api");
const types_1 = require("../../types");
class TimeStamp extends base_1.ContractGenerator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    createService(contractAddr, sender, currency) {
        return new base_1.Operation(this.networkID, new create_service_1.CreateServiceFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, currency));
    }
    append(contractAddr, sender, projectID, requestTimeStamp, data, currency) {
        const fact = new append_1.AppendFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, projectID, requestTimeStamp, data, currency);
        return new base_1.Operation(this.networkID, fact);
    }
    getServiceInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.timestamp.getService(this.api, contractAddr));
        });
    }
    getTimestampInfo(contractAddr, projectID, tid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.timestamp.getTimeStamp(this.api, contractAddr, projectID, tid));
        });
    }
}
exports.TimeStamp = TimeStamp;
//# sourceMappingURL=index.js.map