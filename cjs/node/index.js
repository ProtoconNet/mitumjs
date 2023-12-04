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
exports.Block = exports.Node = exports.Config = exports.NetworkID = exports.Version = void 0;
const config_1 = require("./config");
Object.defineProperty(exports, "Version", { enumerable: true, get: function () { return config_1.Version; } });
Object.defineProperty(exports, "NetworkID", { enumerable: true, get: function () { return config_1.NetworkID; } });
Object.defineProperty(exports, "Config", { enumerable: true, get: function () { return config_1.Config; } });
const api_1 = require("../api");
const types_1 = require("../types");
const error_1 = require("../error");
class Node extends types_1.Generator {
    constructor(api) {
        super("", api);
    }
    getNodeInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            error_1.Assert.check(this.api !== undefined || this.api !== null, error_1.MitumError.detail(error_1.ECODE.NO_API, "no api"));
            return yield api_1.node.getNode(this.api);
        });
    }
}
exports.Node = Node;
class Block extends types_1.Generator {
    constructor(api) {
        super("", api);
    }
    getAllBlocks() {
        return __awaiter(this, void 0, void 0, function* () {
            error_1.Assert.check(this.api !== undefined || this.api !== null, error_1.MitumError.detail(error_1.ECODE.NO_API, "no api"));
            return yield api_1.block.getBlocks(this.api);
        });
    }
    getBlockByHash(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            error_1.Assert.check(this.api !== undefined || this.api !== null, error_1.MitumError.detail(error_1.ECODE.NO_API, "no api"));
            return yield api_1.block.getBlockByHash(this.api, hash);
        });
    }
    getBlockByHeight(height) {
        return __awaiter(this, void 0, void 0, function* () {
            error_1.Assert.check(this.api !== undefined || this.api !== null, error_1.MitumError.detail(error_1.ECODE.NO_API, "no api"));
            return yield api_1.block.getBlockByHeight(this.api, height);
        });
    }
    getOperationsByHash(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            error_1.Assert.check(this.api !== undefined || this.api !== null, error_1.MitumError.detail(error_1.ECODE.NO_API, "no api"));
            return yield api_1.operation.getBlockOperationsByHash(this.api, hash);
        });
    }
    getOperationsByHeight(height) {
        return __awaiter(this, void 0, void 0, function* () {
            error_1.Assert.check(this.api !== undefined || this.api !== null, error_1.MitumError.detail(error_1.ECODE.NO_API, "no api"));
            return yield api_1.operation.getBlockOperationsByHeight(this.api, height);
        });
    }
}
exports.Block = Block;
//# sourceMappingURL=index.js.map