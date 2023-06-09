import { OperationType } from "../types/operation.js";
import { Amount } from "../types/property.js";
import { isIPAddress } from "../utils/validation.js";
import { TimeStamp } from "../utils/time.js";
import { CreateAccountsItem, CreateAccountsFact } from "./create.js";
import { M2RandomN, M2EtherRandomN } from "./random.js";
import { Keys, PubKey } from "./publicKey.js";
import { Operation } from "../operation/index.js";
import { KeyUpdaterFact } from "./keyUpdate.js";
import accountInfo from "./information.js";
import { M2KeyPair } from "./key.js";
const BTC = "btc";
const ETH = "ether";
export class Account {
    constructor(networkID, provider) {
        this._networkID = "";
        this._node = "";
        this._setNode(provider);
        this._setChain(networkID);
    }
    _setNode(provider) {
        if (isIPAddress(provider)) {
            this._node = provider;
        }
    }
    _setChain(networkID) {
        this._networkID = networkID;
    }
    key(seed) {
        if (seed === undefined) {
            return M2KeyPair.random(BTC);
        }
        return M2KeyPair.fromSeed(seed, BTC);
    }
    keys(n) {
        return M2RandomN(n, BTC);
    }
    fromPrivateKey(key) {
        return M2KeyPair.fromPrivate(key);
    }
    etherKey(seed) {
        if (seed === undefined || seed.length === 0) {
            return M2KeyPair.random(ETH);
        }
        return M2KeyPair.fromSeed(seed, ETH);
    }
    etherKeys(n) {
        return M2EtherRandomN(n, ETH);
    }
    address(pubKey) {
        const address = this.pubToKeys([{ key: pubKey, weight: 100 }], 100).address;
        return address.toString();
    }
    etherAddress(pubKey) {
        const address = this.pubToKeys([{ key: pubKey, weight: 100 }], 100).etherAddress;
        return address.toString();
    }
    addressForMultiSig(pubKeys, threshold) {
        const address = this.pubToKeys(pubKeys, threshold).address;
        return address.toString();
    }
    etherAddressForMultiSig(pubKeys, threshold) {
        const address = this.pubToKeys(pubKeys, threshold).etherAddress;
        return address.toString();
    }
    createWallet(sender, currencyID, amount, seed, weight = 100) {
        let keypair;
        if (seed === undefined || typeof seed === "number") {
            keypair = M2KeyPair.random(BTC);
        }
        else {
            keypair = M2KeyPair.fromSeed(seed, BTC);
        }
        let wt = weight;
        if (typeof seed === "number") {
            wt = seed;
        }
        const privatekey = keypair.privateKey.toString();
        const publickey = keypair.publicKey.toString();
        const address = this.pubToKeys([{ key: publickey, weight: wt }], wt).address.toString();
        const keys = this.pubToKeys([{ key: publickey, weight: wt }], wt);
        const amountArr = new Amount(currencyID, amount);
        const token = new TimeStamp().UTC();
        const item = new CreateAccountsItem(keys, [amountArr], BTC);
        const fact = new CreateAccountsFact(token, sender, [item]);
        return {
            wallet: { privatekey, publickey, address },
            operation: new OperationType(this._networkID, fact),
        };
    }
    async touch(privatekey, wallet) {
        const oper = new Operation(this._node);
        const signedOperation = oper.sign(privatekey, wallet.operation);
        const res = await oper.send(signedOperation);
        return res.data;
    }
    create(senderAddr, receiverPub, currentID, amount) {
        const keys = this.pubToKeys([{ key: receiverPub, weight: 100 }], 100);
        const amountArr = new Amount(currentID, amount);
        const token = new TimeStamp().UTC();
        const item = new CreateAccountsItem(keys, [amountArr], BTC);
        const fact = new CreateAccountsFact(token, senderAddr, [item]);
        return new OperationType(this._networkID, fact);
    }
    createEtherAccount(senderAddr, receiverPub, currentID, amount) {
        const keys = this.pubToKeys([{ key: receiverPub, weight: 100 }], 100);
        const amountArr = new Amount(currentID, amount);
        const token = new TimeStamp().UTC();
        const item = new CreateAccountsItem(keys, [amountArr], ETH);
        const fact = new CreateAccountsFact(token, senderAddr, [item]);
        return new OperationType(this._networkID, fact);
    }
    createMultiSig(senderAddr, receiverPubArr, currentID, amount, threshold) {
        const keys = this.pubToKeys(receiverPubArr, threshold);
        const amountArr = new Amount(currentID, amount);
        const token = new TimeStamp().UTC();
        const item = new CreateAccountsItem(keys, [amountArr], BTC);
        const fact = new CreateAccountsFact(token, senderAddr, [item]);
        return new OperationType(this._networkID, fact);
    }
    createEtherMultiSig(senderAddr, receiverPubArr, currentID, amount, threshold) {
        const keys = this.pubToKeys(receiverPubArr, threshold);
        const amountArr = new Amount(currentID, amount);
        const token = new TimeStamp().UTC();
        const item = new CreateAccountsItem(keys, [amountArr], ETH);
        const fact = new CreateAccountsFact(token, senderAddr, [item]);
        return new OperationType(this._networkID, fact);
    }
    update(targetAddr, newPubArr, currentID) {
        const key = this.pubToKeys([{ key: newPubArr, weight: 100 }], 100);
        const token = new TimeStamp().UTC();
        const fact = new KeyUpdaterFact(token, targetAddr, key, currentID);
        return new OperationType(this._networkID, fact);
    }
    updateMultiSig(targetAddr, newPubArr, currentID, threshold) {
        const keys = this.pubToKeys(newPubArr, threshold);
        const token = new TimeStamp().UTC();
        const fact = new KeyUpdaterFact(token, targetAddr, keys, currentID);
        return new OperationType(this._networkID, fact);
    }
    pubToKeys(pubKeys, threshold) {
        const pubs = pubKeys.map((pub) => new PubKey(pub.key, pub.weight));
        return new Keys(pubs, threshold);
    }
    async getAccountInfo(address) {
        return await accountInfo.getAddressInfo(this._node, address);
    }
    async getOperation(address) {
        return await accountInfo.getOperationsByAddress(this._node, address);
    }
    async getByPublickey(publickey) {
        return await accountInfo.getAccountInfoByPublickey(this._node, publickey);
    }
}
//# sourceMappingURL=index.js.map