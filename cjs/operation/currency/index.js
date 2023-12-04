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
exports.Contract = exports.Account = exports.Currency = void 0;
const create_account_1 = require("./create-account");
const update_key_1 = require("./update-key");
const transfer_1 = require("./transfer");
const create_contract_account_1 = require("./create-contract-account");
const withdraw_1 = require("./withdraw");
const update_operator_1 = require("./update-operator");
const register_currency_1 = require("./register-currency");
const update_currency_1 = require("./update-currency");
const mint_1 = require("./mint");
const currency_design_1 = require("./currency-design");
const base_1 = require("../base");
const api_1 = __importStar(require("../../api"));
const common_1 = require("../../common");
const types_1 = require("../../types");
const key_1 = require("../../key");
const error_1 = require("../../error");
class Currency extends types_1.Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    create(data) {
        const keysToCheck = ['currency', 'genesisAddress', 'totalSupply', 'minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            error_1.Assert.check(data[key] !== undefined, error_1.MitumError.detail(error_1.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createData structure`));
        });
        const amount = new common_1.Amount(data.currency, data.totalSupply);
        const design = new currency_design_1.CurrencyDesign(amount, data.genesisAddress, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.ratio, data.minFee, data.maxFee));
        return new base_1.Operation(this.networkID, new register_currency_1.RegisterCurrencyFact(types_1.TimeStamp.new().UTC(), design));
    }
    setPolicy(data) {
        const keysToCheck = ['currency', 'genesisAddress', 'totalSupply', 'minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            error_1.Assert.check(data[key] !== undefined, error_1.MitumError.detail(error_1.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createData structure`));
        });
        return new base_1.Operation(this.networkID, new update_currency_1.UpdateCurrencyFact(types_1.TimeStamp.new().UTC(), data.currency, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.ratio, data.minFee, data.maxFee)));
    }
    buildPolicy(feeType, minBalance, receiver, fee, ratio, min, max) {
        switch (feeType) {
            case "nil":
                return new currency_design_1.CurrencyPolicy(minBalance, new currency_design_1.NilFeeer());
            case "fixed":
                error_1.Assert.check(fee !== undefined, error_1.MitumError.detail(error_1.ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no fee"));
                return new currency_design_1.CurrencyPolicy(minBalance, new currency_design_1.FixedFeeer(receiver, fee));
            case "ratio":
                error_1.Assert.check(ratio !== undefined, error_1.MitumError.detail(error_1.ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no ratio"));
                error_1.Assert.check(min !== undefined, error_1.MitumError.detail(error_1.ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no min fee"));
                error_1.Assert.check(max !== undefined, error_1.MitumError.detail(error_1.ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no max fee"));
                return new currency_design_1.CurrencyPolicy(minBalance, new currency_design_1.RatioFeeer(receiver, ratio, min, max));
            default:
                throw error_1.MitumError.detail(error_1.ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "invalid fee type");
        }
    }
    transfer(sender, receiver, currency, amount) {
        return new base_1.Operation(this.networkID, new transfer_1.TransferFact(types_1.TimeStamp.new().UTC(), sender, [
            new transfer_1.TransferItem(receiver, [new common_1.Amount(currency, amount)])
        ]));
    }
    withdraw(sender, target, currency, amount) {
        return new base_1.Operation(this.networkID, new withdraw_1.WithdrawFact(types_1.TimeStamp.new().UTC(), sender, [
            new withdraw_1.WithdrawItem(target, [new common_1.Amount(currency, amount)])
        ]));
    }
    mint(receiver, currency, amount) {
        return new base_1.Operation(this.networkID, new mint_1.MintFact(types_1.TimeStamp.new().UTC(), [
            new mint_1.MintItem(receiver, new common_1.Amount(currency, amount))
        ]));
    }
    getAllCurrencies() {
        return __awaiter(this, void 0, void 0, function* () {
            const datas = yield (0, api_1.getAPIData)(() => api_1.default.currency.getCurrencies(this.api));
            return datas
                ? Object.keys(datas._links).filter(c => !(c === "self" || c === "currency:{currencyid}")).map(c => c)
                : null;
        });
    }
    getCurrency(cid) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, api_1.getAPIData)(() => api_1.default.currency.getCurrency(this.api, cid));
            return data ? data._embedded : null;
        });
    }
}
exports.Currency = Currency;
class Account extends key_1.KeyG {
    constructor(networkID, api) {
        super(networkID, api);
    }
    createWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? key_1.KeyPair.fromSeed(seed) : key_1.KeyPair.random();
        const ks = new key_1.Keys([new key_1.PubKey(kp.publicKey, weight !== null && weight !== void 0 ? weight : 100)], weight !== null && weight !== void 0 ? weight : 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.address.toString(),
            },
            operation: new base_1.Operation(this.networkID, new create_account_1.CreateAccountFact(types_1.TimeStamp.new().UTC(), sender, [
                new create_account_1.CreateAccountItem(ks, [new common_1.Amount(currency, amount)], "mitum")
            ])),
        };
    }
    createEtherWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? key_1.KeyPair.fromSeed(seed, "ether") : key_1.KeyPair.random("ether");
        const ks = new key_1.EtherKeys([new key_1.PubKey(kp.publicKey, weight !== null && weight !== void 0 ? weight : 100)], weight !== null && weight !== void 0 ? weight : 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            },
            operation: new base_1.Operation(this.networkID, new create_account_1.CreateAccountFact(types_1.TimeStamp.new().UTC(), sender, [
                new create_account_1.CreateAccountItem(ks, [new common_1.Amount(currency, amount)], "ether")
            ])),
        };
    }
    createAccount(sender, key, currency, amount) {
        return new base_1.Operation(this.networkID, new create_account_1.CreateAccountFact(types_1.TimeStamp.new().UTC(), sender, [
            new create_account_1.CreateAccountItem(new key_1.Keys([new key_1.PubKey(key, 100)], 100), [new common_1.Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherAccount(sender, key, currency, amount) {
        return new base_1.Operation(this.networkID, new create_account_1.CreateAccountFact(types_1.TimeStamp.new().UTC(), sender, [
            new create_account_1.CreateAccountItem(new key_1.EtherKeys([new key_1.PubKey(key, 100)], 100), [new common_1.Amount(currency, amount)], "ether")
        ]));
    }
    createMultiSig(sender, keys, currency, amount, threshold) {
        return new base_1.Operation(this.networkID, new create_account_1.CreateAccountFact(types_1.TimeStamp.new().UTC(), sender, [
            new create_account_1.CreateAccountItem(new key_1.Keys(keys.map(k => k instanceof key_1.PubKey ? k : new key_1.PubKey(k.key, k.weight)), threshold), [new common_1.Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherMultiSig(sender, keys, currency, amount, threshold) {
        return new base_1.Operation(this.networkID, new create_account_1.CreateAccountFact(types_1.TimeStamp.new().UTC(), sender, [
            new create_account_1.CreateAccountItem(new key_1.Keys(keys.map(k => k instanceof key_1.PubKey ? k : new key_1.PubKey(k.key, k.weight)), threshold), [new common_1.Amount(currency, amount)], "ether")
        ]));
    }
    update(target, newKey, currency) {
        const suffix = target.toString().slice(-3);
        if (suffix === "mca") {
            return new base_1.Operation(this.networkID, new update_key_1.UpdateKeyFact(types_1.TimeStamp.new().UTC(), target, new key_1.Keys([new key_1.PubKey(newKey, 100)], 100), currency));
        }
        return new base_1.Operation(this.networkID, new update_key_1.UpdateKeyFact(types_1.TimeStamp.new().UTC(), target, new key_1.EtherKeys([new key_1.PubKey(newKey, 100)], 100), currency));
    }
    updateMultiSig(target, newKeys, currency, threshold) {
        const suffix = target.toString().slice(-3);
        if (suffix === "mca") {
            return new base_1.Operation(this.networkID, new update_key_1.UpdateKeyFact(types_1.TimeStamp.new().UTC(), target, new key_1.Keys(newKeys.map(k => k instanceof key_1.PubKey ? k : new key_1.PubKey(k.key, k.weight)), threshold), currency));
        }
        return new base_1.Operation(this.networkID, new update_key_1.UpdateKeyFact(types_1.TimeStamp.new().UTC(), target, new key_1.EtherKeys(newKeys.map(k => k instanceof key_1.PubKey ? k : new key_1.PubKey(k.key, k.weight)), threshold), currency));
    }
    getMultiSigAddress(keys, threshold) {
        const keysArray = new key_1.Keys(keys.map(k => k instanceof key_1.PubKey ? k : new key_1.PubKey(k.key, k.weight)), threshold);
        return keysArray.address.toString(); // btc
    }
    touch(privatekey, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = wallet.operation;
            op.sign(privatekey);
            return yield (0, api_1.getAPIData)(() => api_1.default.operation.send(this.api, op.toHintedObject()));
        });
    }
    getAccountInfo(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, api_1.getAPIData)(() => api_1.default.account.getAccount(this.api, address));
            return data ? data._embedded : null;
        });
    }
    getOperations(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, api_1.getAPIData)(() => api_1.default.operation.getAccountOperations(this.api, address));
            return data ? data._embedded : null;
        });
    }
    getByPublickey(publickey) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, api_1.getAPIData)(() => api_1.default.account.getAccountByPublicKey(this.api, publickey));
            return data ? data._embedded : null;
        });
    }
    balance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, api_1.getAPIData)(() => api_1.default.account.getAccount(this.api, address));
            return data ? data._embedded.balance : null;
        });
    }
}
exports.Account = Account;
class Contract extends types_1.Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    createWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? key_1.KeyPair.fromSeed(seed) : key_1.KeyPair.random();
        const ks = new key_1.Keys([new key_1.PubKey(kp.publicKey, weight !== null && weight !== void 0 ? weight : 100)], weight !== null && weight !== void 0 ? weight : 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.address.toString(),
            },
            operation: new base_1.Operation(this.networkID, new create_contract_account_1.CreateContractAccountFact(types_1.TimeStamp.new().UTC(), sender, [
                new create_contract_account_1.CreateContractAccountItem(ks, [new common_1.Amount(currency, amount)], "mitum")
            ])),
        };
    }
    createEtherWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? key_1.KeyPair.fromSeed(seed, "ether") : key_1.KeyPair.random("ether");
        const ks = new key_1.EtherKeys([new key_1.PubKey(kp.publicKey, weight !== null && weight !== void 0 ? weight : 100)], weight !== null && weight !== void 0 ? weight : 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: new key_1.EtherKeys([new key_1.PubKey(kp.publicKey, 100)], 100).etherAddress.toString(),
            },
            operation: new base_1.Operation(this.networkID, new create_contract_account_1.CreateContractAccountFact(types_1.TimeStamp.new().UTC(), sender, [
                new create_contract_account_1.CreateContractAccountItem(ks, [new common_1.Amount(currency, amount)], "ether")
            ])),
        };
    }
    createAccount(sender, key, currency, amount) {
        return new base_1.Operation(this.networkID, new create_contract_account_1.CreateContractAccountFact(types_1.TimeStamp.new().UTC(), sender, [
            new create_contract_account_1.CreateContractAccountItem(new key_1.Keys([new key_1.PubKey(key, 100)], 100), [new common_1.Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherAccount(sender, key, currency, amount) {
        return new base_1.Operation(this.networkID, new create_contract_account_1.CreateContractAccountFact(types_1.TimeStamp.new().UTC(), sender, [
            new create_contract_account_1.CreateContractAccountItem(new key_1.EtherKeys([new key_1.PubKey(key, 100)], 100), [new common_1.Amount(currency, amount)], "ether")
        ]));
    }
    createMultiSig(sender, keys, currency, amount, threshold) {
        return new base_1.Operation(this.networkID, new create_contract_account_1.CreateContractAccountFact(types_1.TimeStamp.new().UTC(), sender, [
            new create_contract_account_1.CreateContractAccountItem(new key_1.Keys(keys.map(k => k instanceof key_1.PubKey ? k : new key_1.PubKey(k.key, k.weight)), threshold), [new common_1.Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherMultiSig(sender, keys, currency, amount, threshold) {
        return new base_1.Operation(this.networkID, new create_contract_account_1.CreateContractAccountFact(types_1.TimeStamp.new().UTC(), sender, [
            new create_contract_account_1.CreateContractAccountItem(new key_1.EtherKeys(keys.map(k => k instanceof key_1.PubKey ? k : new key_1.PubKey(k.key, k.weight)), threshold), [new common_1.Amount(currency, amount)], "ether")
        ]));
    }
    updateOperator(sender, contract, currency, operators) {
        return new base_1.Operation(this.networkID, new update_operator_1.UpdateOperatorFact(types_1.TimeStamp.new().UTC(), sender, contract, currency, operators));
    }
    touch(privatekey, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = wallet.operation;
            op.sign(privatekey);
            return yield (0, api_1.getAPIData)(() => api_1.default.operation.send(this.api, op.toHintedObject()));
        });
    }
    getContractInfo(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, api_1.getAPIData)(() => api_1.default.account.getAccount(this.api, address));
            return data ? data._embedded : null;
        });
    }
}
exports.Contract = Contract;
//# sourceMappingURL=index.js.map