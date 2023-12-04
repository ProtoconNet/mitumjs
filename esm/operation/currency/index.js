import { CreateAccountItem, CreateAccountFact } from "./create-account";
import { UpdateKeyFact } from "./update-key";
import { TransferItem, TransferFact } from "./transfer";
import { CreateContractAccountItem, CreateContractAccountFact } from "./create-contract-account";
import { WithdrawItem, WithdrawFact } from "./withdraw";
import { UpdateOperatorFact } from "./update-operator";
import { RegisterCurrencyFact } from "./register-currency";
import { UpdateCurrencyFact } from "./update-currency";
import { MintItem, MintFact } from "./mint";
import { CurrencyDesign, CurrencyPolicy, NilFeeer, FixedFeeer, RatioFeeer } from "./currency-design";
import { Operation } from "../base";
import api, { getAPIData } from "../../api";
import { Amount } from "../../common";
import { Generator, TimeStamp } from "../../types";
import { KeyPair, Keys, PubKey, KeyG, EtherKeys } from "../../key";
import { Assert, ECODE, MitumError } from "../../error";
export class Currency extends Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    create(data) {
        const keysToCheck = ['currency', 'genesisAddress', 'totalSupply', 'minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createData structure`));
        });
        const amount = new Amount(data.currency, data.totalSupply);
        const design = new CurrencyDesign(amount, data.genesisAddress, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.ratio, data.minFee, data.maxFee));
        return new Operation(this.networkID, new RegisterCurrencyFact(TimeStamp.new().UTC(), design));
    }
    setPolicy(data) {
        const keysToCheck = ['currency', 'genesisAddress', 'totalSupply', 'minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createData structure`));
        });
        return new Operation(this.networkID, new UpdateCurrencyFact(TimeStamp.new().UTC(), data.currency, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.ratio, data.minFee, data.maxFee)));
    }
    buildPolicy(feeType, minBalance, receiver, fee, ratio, min, max) {
        switch (feeType) {
            case "nil":
                return new CurrencyPolicy(minBalance, new NilFeeer());
            case "fixed":
                Assert.check(fee !== undefined, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no fee"));
                return new CurrencyPolicy(minBalance, new FixedFeeer(receiver, fee));
            case "ratio":
                Assert.check(ratio !== undefined, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no ratio"));
                Assert.check(min !== undefined, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no min fee"));
                Assert.check(max !== undefined, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no max fee"));
                return new CurrencyPolicy(minBalance, new RatioFeeer(receiver, ratio, min, max));
            default:
                throw MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "invalid fee type");
        }
    }
    transfer(sender, receiver, currency, amount) {
        return new Operation(this.networkID, new TransferFact(TimeStamp.new().UTC(), sender, [
            new TransferItem(receiver, [new Amount(currency, amount)])
        ]));
    }
    withdraw(sender, target, currency, amount) {
        return new Operation(this.networkID, new WithdrawFact(TimeStamp.new().UTC(), sender, [
            new WithdrawItem(target, [new Amount(currency, amount)])
        ]));
    }
    mint(receiver, currency, amount) {
        return new Operation(this.networkID, new MintFact(TimeStamp.new().UTC(), [
            new MintItem(receiver, new Amount(currency, amount))
        ]));
    }
    async getAllCurrencies() {
        const datas = await getAPIData(() => api.currency.getCurrencies(this.api));
        return datas
            ? Object.keys(datas._links).filter(c => !(c === "self" || c === "currency:{currencyid}")).map(c => c)
            : null;
    }
    async getCurrency(cid) {
        const data = await getAPIData(() => api.currency.getCurrency(this.api, cid));
        return data ? data._embedded : null;
    }
}
export class Account extends KeyG {
    constructor(networkID, api) {
        super(networkID, api);
    }
    createWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? KeyPair.fromSeed(seed) : KeyPair.random();
        const ks = new Keys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.address.toString(),
            },
            operation: new Operation(this.networkID, new CreateAccountFact(TimeStamp.new().UTC(), sender, [
                new CreateAccountItem(ks, [new Amount(currency, amount)], "mitum")
            ])),
        };
    }
    createEtherWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? KeyPair.fromSeed(seed, "ether") : KeyPair.random("ether");
        const ks = new EtherKeys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            },
            operation: new Operation(this.networkID, new CreateAccountFact(TimeStamp.new().UTC(), sender, [
                new CreateAccountItem(ks, [new Amount(currency, amount)], "ether")
            ])),
        };
    }
    createAccount(sender, key, currency, amount) {
        return new Operation(this.networkID, new CreateAccountFact(TimeStamp.new().UTC(), sender, [
            new CreateAccountItem(new Keys([new PubKey(key, 100)], 100), [new Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherAccount(sender, key, currency, amount) {
        return new Operation(this.networkID, new CreateAccountFact(TimeStamp.new().UTC(), sender, [
            new CreateAccountItem(new EtherKeys([new PubKey(key, 100)], 100), [new Amount(currency, amount)], "ether")
        ]));
    }
    createMultiSig(sender, keys, currency, amount, threshold) {
        return new Operation(this.networkID, new CreateAccountFact(TimeStamp.new().UTC(), sender, [
            new CreateAccountItem(new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), [new Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherMultiSig(sender, keys, currency, amount, threshold) {
        return new Operation(this.networkID, new CreateAccountFact(TimeStamp.new().UTC(), sender, [
            new CreateAccountItem(new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), [new Amount(currency, amount)], "ether")
        ]));
    }
    update(target, newKey, currency) {
        const suffix = target.toString().slice(-3);
        if (suffix === "mca") {
            return new Operation(this.networkID, new UpdateKeyFact(TimeStamp.new().UTC(), target, new Keys([new PubKey(newKey, 100)], 100), currency));
        }
        return new Operation(this.networkID, new UpdateKeyFact(TimeStamp.new().UTC(), target, new EtherKeys([new PubKey(newKey, 100)], 100), currency));
    }
    updateMultiSig(target, newKeys, currency, threshold) {
        const suffix = target.toString().slice(-3);
        if (suffix === "mca") {
            return new Operation(this.networkID, new UpdateKeyFact(TimeStamp.new().UTC(), target, new Keys(newKeys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), currency));
        }
        return new Operation(this.networkID, new UpdateKeyFact(TimeStamp.new().UTC(), target, new EtherKeys(newKeys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), currency));
    }
    getMultiSigAddress(keys, threshold) {
        const keysArray = new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold);
        return keysArray.address.toString(); // btc
    }
    async touch(privatekey, wallet) {
        const op = wallet.operation;
        op.sign(privatekey);
        return await getAPIData(() => api.operation.send(this.api, op.toHintedObject()));
    }
    async getAccountInfo(address) {
        const data = await getAPIData(() => api.account.getAccount(this.api, address));
        return data ? data._embedded : null;
    }
    async getOperations(address) {
        const data = await getAPIData(() => api.operation.getAccountOperations(this.api, address));
        return data ? data._embedded : null;
    }
    async getByPublickey(publickey) {
        const data = await getAPIData(() => api.account.getAccountByPublicKey(this.api, publickey));
        return data ? data._embedded : null;
    }
    async balance(address) {
        const data = await getAPIData(() => api.account.getAccount(this.api, address));
        return data ? data._embedded.balance : null;
    }
}
export class Contract extends Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    createWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? KeyPair.fromSeed(seed) : KeyPair.random();
        const ks = new Keys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.address.toString(),
            },
            operation: new Operation(this.networkID, new CreateContractAccountFact(TimeStamp.new().UTC(), sender, [
                new CreateContractAccountItem(ks, [new Amount(currency, amount)], "mitum")
            ])),
        };
    }
    createEtherWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? KeyPair.fromSeed(seed, "ether") : KeyPair.random("ether");
        const ks = new EtherKeys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: new EtherKeys([new PubKey(kp.publicKey, 100)], 100).etherAddress.toString(),
            },
            operation: new Operation(this.networkID, new CreateContractAccountFact(TimeStamp.new().UTC(), sender, [
                new CreateContractAccountItem(ks, [new Amount(currency, amount)], "ether")
            ])),
        };
    }
    createAccount(sender, key, currency, amount) {
        return new Operation(this.networkID, new CreateContractAccountFact(TimeStamp.new().UTC(), sender, [
            new CreateContractAccountItem(new Keys([new PubKey(key, 100)], 100), [new Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherAccount(sender, key, currency, amount) {
        return new Operation(this.networkID, new CreateContractAccountFact(TimeStamp.new().UTC(), sender, [
            new CreateContractAccountItem(new EtherKeys([new PubKey(key, 100)], 100), [new Amount(currency, amount)], "ether")
        ]));
    }
    createMultiSig(sender, keys, currency, amount, threshold) {
        return new Operation(this.networkID, new CreateContractAccountFact(TimeStamp.new().UTC(), sender, [
            new CreateContractAccountItem(new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), [new Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherMultiSig(sender, keys, currency, amount, threshold) {
        return new Operation(this.networkID, new CreateContractAccountFact(TimeStamp.new().UTC(), sender, [
            new CreateContractAccountItem(new EtherKeys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), [new Amount(currency, amount)], "ether")
        ]));
    }
    updateOperator(sender, contract, currency, operators) {
        return new Operation(this.networkID, new UpdateOperatorFact(TimeStamp.new().UTC(), sender, contract, currency, operators));
    }
    async touch(privatekey, wallet) {
        const op = wallet.operation;
        op.sign(privatekey);
        return await getAPIData(() => api.operation.send(this.api, op.toHintedObject()));
    }
    async getContractInfo(address) {
        const data = await getAPIData(() => api.account.getAccount(this.api, address));
        return data ? data._embedded : null;
    }
}
//# sourceMappingURL=index.js.map