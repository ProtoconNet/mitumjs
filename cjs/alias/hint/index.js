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
    FACT_SIGN: "base-fact-sign",
    CURRENCY: currency_1.default,
    NFT: nft_1.default,
    CREDENTIAL: credential_1.default,
    DAO: dao_1.default,
    KYC: kyc_1.default,
    STO: sto_1.default,
    TIMESTAMP: timestamp_1.default,
    TOKEN: token_1.default,
    POINT: point_1.default,
};
//# sourceMappingURL=index.js.map