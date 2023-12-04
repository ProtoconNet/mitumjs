"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const currency_1 = __importDefault(require("./currency"));
const nft_1 = __importDefault(require("./nft"));
const credential_1 = __importDefault(require("./credential"));
const dao_1 = __importDefault(require("./dao"));
const kyc_1 = __importDefault(require("./kyc"));
const sto_1 = __importDefault(require("./sto"));
const timestamp_1 = __importDefault(require("./timestamp"));
const token_1 = __importDefault(require("./token"));
const point_1 = __importDefault(require("./point"));
exports.default = {
    currency: currency_1.default,
    contract: {
        nft: nft_1.default,
        credential: credential_1.default,
        dao: dao_1.default,
        kyc: kyc_1.default,
        sto: sto_1.default,
        timestamp: timestamp_1.default,
        token: token_1.default,
        point: point_1.default,
    },
};
//# sourceMappingURL=index.js.map