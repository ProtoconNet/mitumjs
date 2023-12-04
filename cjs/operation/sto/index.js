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
exports.STO = void 0;
const create_security_token_1 = require("./create-security-token");
const issue_sercurity_token_1 = require("./issue-sercurity-token");
const authorize_operator_1 = require("./authorize-operator");
const revoke_operator_1 = require("./revoke-operator");
const redeem_token_1 = require("./redeem-token");
const set_document_1 = require("./set-document");
const transfer_security_token_partition_1 = require("./transfer-security-token-partition");
const api_1 = require("../../api");
const base_1 = require("../base");
const types_1 = require("../../types");
const error_1 = require("../../error");
class STO extends base_1.ContractGenerator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    authorizeOperator(contractAddr, sender, operator, partition, currency) {
        return new base_1.Operation(this.networkID, new authorize_operator_1.AuthorizeOperatorFact(types_1.TimeStamp.new().UTC(), sender, [
            new authorize_operator_1.AuthorizeOperatorItem(contractAddr, operator, partition, currency)
        ]));
    }
    createService(contractAddr, sender, data, currency) {
        const keysToCheck = ['granularity', 'defaultPartition'];
        keysToCheck.forEach((key) => {
            error_1.Assert.check(data[key] !== undefined, error_1.MitumError.detail(error_1.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createServiceData structure`));
        });
        return new base_1.Operation(this.networkID, new create_security_token_1.CreateSecurityTokenFact(types_1.TimeStamp.new().UTC(), sender, [
            new create_security_token_1.CreateSecurityTokenItem(contractAddr, data.granularity, data.defaultPartition, currency)
        ]));
    }
    issue(contractAddr, sender, receiver, partition, amount, currency) {
        return new base_1.Operation(this.networkID, new issue_sercurity_token_1.IssueSecurityTokenFact(types_1.TimeStamp.new().UTC(), sender, [
            new issue_sercurity_token_1.IssueSecurityTokenItem(contractAddr, receiver, amount, partition, currency)
        ]));
    }
    redeem(contractAddr, sender, tokenHolder, partition, amount, currency) {
        return new base_1.Operation(this.networkID, new redeem_token_1.RedeemTokenFact(types_1.TimeStamp.new().UTC(), sender, [
            new redeem_token_1.RedeemTokenItem(contractAddr, tokenHolder, amount, partition, currency)
        ]));
    }
    revokeOperator(contractAddr, sender, operator, partition, currency) {
        return new base_1.Operation(this.networkID, new revoke_operator_1.RevokeOperatorFact(types_1.TimeStamp.new().UTC(), sender, [
            new revoke_operator_1.RevokeOperatorItem(contractAddr, operator, partition, currency)
        ]));
    }
    setDocument(contractAddr, sender, title, uri, documentHash, currency) {
        return new base_1.Operation(this.networkID, new set_document_1.SetDocumentFact(types_1.TimeStamp.new().UTC(), sender, contractAddr, title, uri, documentHash, currency));
    }
    transferByPartition(contractAddr, sender, holder, receiver, partition, amount, currency) {
        return new base_1.Operation(this.networkID, new transfer_security_token_partition_1.TransferSecurityTokenPartitionFact(types_1.TimeStamp.new().UTC(), sender, [
            new transfer_security_token_partition_1.TransferSecurityTokenPartitionItem(contractAddr, holder, receiver, partition, amount, currency)
        ]));
    }
    getServiceInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.sto.getService(this.api, contractAddr));
        });
    }
    getPartitionsInfo(contractAddr, holder) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.sto.getPartitions(this.api, contractAddr, holder));
        });
    }
    getBalanceByHolder(contractAddr, holder, partition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.sto.getBalanceByHolder(this.api, contractAddr, holder, partition));
        });
    }
    getOperatorsByHolder(contractAddr, holder, partition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.sto.getOperatorsByHolder(this.api, contractAddr, holder, partition));
        });
    }
    getPartitionBalanceInfo(contractAddr, partition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.sto.getPartitionBalance(this.api, contractAddr, partition));
        });
    }
    getAuthorizedInfo(contractAddr, operator) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, api_1.getAPIData)(() => api_1.contract.sto.getAuthorized(this.api, contractAddr, operator));
        });
    }
}
exports.STO = STO;
//# sourceMappingURL=index.js.map