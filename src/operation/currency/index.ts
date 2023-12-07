import { CreateAccountItem, CreateAccountFact } from "./create-account"
import { UpdateKeyFact } from "./update-key"
import { TransferItem, TransferFact } from "./transfer"
import { CreateContractAccountItem, CreateContractAccountFact } from "./create-contract-account"
import { WithdrawItem, WithdrawFact } from "./withdraw"
import { UpdateOperatorFact } from "./update-operator"
import { RegisterCurrencyFact } from "./register-currency"
import { UpdateCurrencyFact } from "./update-currency"
import { MintItem, MintFact } from "./mint"

import { CurrencyDesign, CurrencyPolicy, NilFeeer, FixedFeeer, RatioFeeer } from "./currency-design"

import { Operation } from "../base"

import api, { getAPIData } from "../../api"
import { Amount, CurrencyID } from "../../common"
import { Big, Generator, IP, TimeStamp } from "../../types"
import { Address, Key, KeyPair, Keys, PubKey, Account as AccountType, KeyG, EtherKeys } from "../../key"
import { Assert, ECODE, MitumError } from "../../error"

type createData = {
    currency: string | CurrencyID
    genesisAddress: string | Address
    totalSupply: string | number | Big
    minBalance: string | number | Big
    feeType: "nil" | "fixed" | "ratio"
    feeReceiver: string | Address
    fee?: string | number | Big
    ratio?: number
    minFee?: string | number | Big
    maxFee?: string | number | Big
}

type keysType =
    ({ key: string | Key | PubKey, weight: string | number | Big } | PubKey)[]
    | Array<{ key: string | Key | PubKey; weight: string | number | Big }>

export class Currency extends Generator {
    constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }

    create(data: createData) {
        const keysToCheck: (keyof createData)[] = ['currency', 'genesisAddress', 'totalSupply', 'minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createData structure`))
        });

        const amount = new Amount(data.currency, data.totalSupply)
        const design = new CurrencyDesign(
            amount,
            data.genesisAddress,
            this.buildPolicy(
                data.feeType,
                data.minBalance,
                data.feeReceiver,
                data.fee,
                data.ratio,
                data.minFee,
                data.maxFee,
            ),
        )

        return new Operation(
            this.networkID,
            new RegisterCurrencyFact(TimeStamp.new().UTC(), design),
        ) 
    }

    setPolicy(data: createData) {
        const keysToCheck: (keyof createData)[] = ['currency', 'genesisAddress', 'totalSupply', 'minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createData structure`))
        });

        return new Operation(
            this.networkID,
            new UpdateCurrencyFact(
                TimeStamp.new().UTC(),
                data.currency,
                this.buildPolicy(
                    data.feeType,
                    data.minBalance,
                    data.feeReceiver,
                    data.fee,
                    data.ratio,
                    data.minFee,
                    data.maxFee,
                ),
            ),
        )
    }

    private buildPolicy(
        feeType: "nil" | "fixed" | "ratio",
        minBalance: string | number | Big,
        receiver: string | Address,
        fee?: string | number | Big,
        ratio?: number,
        min?: string | number | Big,
        max?: string | number | Big,
    ): CurrencyPolicy {
        switch (feeType) {
            case "nil":
                return new CurrencyPolicy(minBalance, new NilFeeer())
            case "fixed":
                Assert.check(
                    fee !== undefined,
                    MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no fee")
                )
                return new CurrencyPolicy(minBalance, new FixedFeeer(receiver, fee!))
            case "ratio":
                Assert.check(
                    ratio !== undefined,
                    MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no ratio")
                )
                Assert.check(
                    min !== undefined,
                    MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no min fee")
                )
                Assert.check(
                    max !== undefined,
                    MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no max fee")
                )
                return new CurrencyPolicy(
                    minBalance,
                    new RatioFeeer(receiver, ratio!, min!, max!),
                )
            default:
                throw MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "invalid fee type")
        }
    }

    transfer(
        sender: string | Address,
        receiver: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new TransferFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new TransferItem(receiver, [new Amount(currency, amount)])
                ],
            ),
        )
    }

    withdraw(
        sender: string | Address,
        target: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new WithdrawFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new WithdrawItem(target, [new Amount(currency, amount)])
                ],
            ),
        )
    }

    mint(
        receiver: string | Address,
        currency: string | CurrencyID,
        amount: number
    ) {
        return new Operation(
            this.networkID,
            new MintFact(
                TimeStamp.new().UTC(),
                [
                    new MintItem(receiver, new Amount(currency, amount))
                ],
            ),
        )
    }

    async getAllCurrencies(): Promise<string[] | null> {
        const datas = await getAPIData(() => api.currency.getCurrencies(this.api))

        return datas
            ? Object.keys(datas._links).filter(
                c => !(c === "self" || c === "currency:{currencyid}")).map(c => c)
            : null
    }

    async getCurrency(cid: string | CurrencyID) {
        const data = await getAPIData(() => api.currency.getCurrency(this.api, cid))
        return data ? data._embedded : null
    }
}

export class Account extends KeyG {
    constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }

    createWallet(
        sender: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
        seed?: string,
        weight?: string | number | Big,
    ): { wallet: AccountType, operation: Operation<CreateAccountFact> } {
        const kp = seed ? KeyPair.fromSeed(seed) : KeyPair.random()
        const ks = new Keys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100)

        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.address.toString(),
            },
            operation: new Operation(
                this.networkID,
                new CreateAccountFact(
                    TimeStamp.new().UTC(),
                    sender,
                    [
                        new CreateAccountItem(
                            ks,
                            [new Amount(currency, amount)],
                            "mitum",
                        )
                    ],
                ),
            ),
        }
    }

    createEtherWallet(
        sender: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
        seed?: string,
        weight?: string | number | Big,
    ): { wallet: AccountType, operation: Operation<CreateAccountFact> } {
        const kp = seed ? KeyPair.fromSeed(seed, "ether") : KeyPair.random("ether")
        const ks = new EtherKeys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100)

        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            },
            operation: new Operation(
                this.networkID,
                new CreateAccountFact(
                    TimeStamp.new().UTC(),
                    sender,
                    [
                        new CreateAccountItem(
                            ks,
                            [new Amount(currency, amount)],
                            "ether",
                        )
                    ],
                ),
            ),
        }
    }

    createBatchWallet(
        sender: string | Address,
        n: number,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ): { wallet: AccountType[], operation: Operation<CreateAccountFact> } {
        const keyArray = this.keys(n);
        const ksArray = keyArray.map((key) => new Keys([new PubKey(key.publickey, 100)], 100));
        const items = ksArray.map((ks) => new CreateAccountItem(ks,[new Amount(currency, amount)],"mitum",));
        return {
            wallet: keyArray,
            operation: new Operation(
                this.networkID,
                new CreateAccountFact(
                    TimeStamp.new().UTC(),
                    sender,
                    items,
                ),
            ),
        }
    }

    createAccount(
        sender: string | Address,
        key: string | Key | PubKey,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateAccountItem(
                        new Keys([new PubKey(key, 100)], 100),
                        [new Amount(currency, amount)],
                        "mitum",
                    )
                ],
            )
        )
    }

    createEtherAccount(
        sender: string | Address,
        key: string | Key | PubKey,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateAccountItem(
                        new EtherKeys([new PubKey(key, 100)], 100),
                        [new Amount(currency, amount)],
                        "ether",
                    )
                ],
            )
        )
    }

    createMultiSig(
        sender: string | Address,
        keys: keysType,
        currency: string | CurrencyID,
        amount: string | number | Big,
        threshold: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateAccountItem(
                        new Keys(
                            keys.map(k =>
                                k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                            ),
                            threshold,
                        ),
                        [new Amount(currency, amount)],
                        "mitum",
                    )
                ]
            ),
        )
    }

    createEtherMultiSig(
        sender: string | Address,
        keys: keysType,
        currency: string | CurrencyID,
        amount: string | number | Big,
        threshold: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateAccountItem(
                        new EtherKeys(
                            keys.map(k =>
                                k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                            ),
                            threshold,
                        ),
                        [new Amount(currency, amount)],
                        "ether",
                    )
                ]
            ),
        )
    }

    update(
        target: string | Address,
        newKey: string | Key | PubKey,
        currency: string | CurrencyID,
    ) {
        const suffix = target.toString().slice(-3)
        if (suffix === "mca") {
            return new Operation(
                this.networkID,
                new UpdateKeyFact(
                    TimeStamp.new().UTC(),
                    target,
                    new Keys([new PubKey(newKey, 100)], 100),
                    currency,
                ),
            )
        }
        return new Operation(
            this.networkID,
            new UpdateKeyFact(
                TimeStamp.new().UTC(),
                target,
                new EtherKeys([new PubKey(newKey, 100)], 100),
                currency,
            ),
        )
    }

    updateMultiSig(
        target: string | Address,
        newKeys: keysType,
        currency: string | CurrencyID,
        threshold: string | number | Big,
    ) {
        const suffix = target.toString().slice(-3)
        if (suffix === "mca") {
            return new Operation(
                this.networkID,
                new UpdateKeyFact(
                    TimeStamp.new().UTC(),
                    target,
                    new Keys(
                        newKeys.map(k =>
                            k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                        ),
                        threshold,
                    ),
                    currency,
                ),
            )
        } 
        return new Operation(
            this.networkID,
            new UpdateKeyFact(
                TimeStamp.new().UTC(),
                target,
                new EtherKeys(
                    newKeys.map(k =>
                        k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                    ),
                    threshold,
                ),
                currency,
            ),
        )
    }


    getMultiSigAddress (
        keys: keysType,
        threshold: string | number | Big,
    ) {
        const keysArray = new Keys(
            keys.map(k =>
                k instanceof PubKey ? k : new PubKey(k.key, k.weight)
            ),
            threshold,
        )
        return keysArray.address.toString(); // btc
    }

    async touch(
        privatekey: string | Key,
        wallet: { wallet: AccountType, operation: Operation<CreateAccountFact> }
    ) {
        const op = wallet.operation
        op.sign(privatekey)

        return await getAPIData(() => api.operation.send(this.api, op.toHintedObject()))
    }

    async getAccountInfo(address: string | Address) {
        const data = await getAPIData(() => api.account.getAccount(this.api, address))
        return data ? data._embedded : null
    }

    async getOperations(address: string | Address) {
        const data = await getAPIData(() => api.operation.getAccountOperations(this.api, address))
        return data ? data._embedded : null
    }

    async getByPublickey(publickey: string | Key | PubKey) {
        const data = await getAPIData(() => api.account.getAccountByPublicKey(this.api, publickey))
        return data ? data._embedded : null
    }

    async balance(address: string | Address) {
        const data = await getAPIData(() => api.account.getAccount(this.api, address))
        return data ? data._embedded.balance : null
    }
}

export class Contract extends Generator {
    constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }

    createWallet(
        sender: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
        seed?: string,
        weight?: string | number | Big,
    ): { wallet: AccountType, operation: Operation<CreateContractAccountFact> } {
        const kp = seed ? KeyPair.fromSeed(seed) : KeyPair.random()
        const ks = new Keys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100)

        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.address.toString(),
            },
            operation: new Operation(
                this.networkID,
                new CreateContractAccountFact(
                    TimeStamp.new().UTC(),
                    sender,
                    [
                        new CreateContractAccountItem(
                            ks,
                            [new Amount(currency, amount)],
                            "mitum",
                        )
                    ],
                ),
            ),
        }
    }

    createEtherWallet(
        sender: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
        seed?: string,
        weight?: string | number | Big,
    ): { wallet: AccountType, operation: Operation<CreateContractAccountFact> } {
        const kp = seed ? KeyPair.fromSeed(seed, "ether") : KeyPair.random("ether")
        const ks = new EtherKeys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100)

        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: new EtherKeys([new PubKey(kp.publicKey, 100)], 100).etherAddress.toString(),
            },
            operation: new Operation(
                this.networkID,
                new CreateContractAccountFact(
                    TimeStamp.new().UTC(),
                    sender,
                    [
                        new CreateContractAccountItem(
                            ks,
                            [new Amount(currency, amount)],
                            "ether",
                        )
                    ],
                ),
            ),
        }
    }

    createAccount(
        sender: string | Address,
        key: string | Key | PubKey,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateContractAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateContractAccountItem(
                        new Keys([new PubKey(key, 100)], 100),
                        [new Amount(currency, amount)],
                        "mitum",
                    )
                ],
            )
        )
    }

    createEtherAccount(
        sender: string | Address,
        key: string | Key | PubKey,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateContractAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateContractAccountItem(
                        new EtherKeys([new PubKey(key, 100)], 100),
                        [new Amount(currency, amount)],
                        "ether",
                    )
                ],
            )
        )
    }

    createMultiSig(
        sender: string | Address,
        keys: keysType,
        currency: string | CurrencyID,
        amount: string | number | Big,
        threshold: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateContractAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateContractAccountItem(
                        new Keys(
                            keys.map(k =>
                                k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                            ),
                            threshold,
                        ),
                        [new Amount(currency, amount)],
                        "mitum",
                    )
                ]
            ),
        )
    }

    createEtherMultiSig(
        sender: string | Address,
        keys: keysType,
        currency: string | CurrencyID,
        amount: string | number | Big,
        threshold: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateContractAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateContractAccountItem(
                        new EtherKeys(
                            keys.map(k =>
                                k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                            ),
                            threshold,
                        ),
                        [new Amount(currency, amount)],
                        "ether",
                    )
                ]
            ),
        )
    }

    updateOperator(
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
        operators: (string | Address)[],
    ) {
        return new Operation(
            this.networkID,
            new UpdateOperatorFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                currency,
                operators,
            )
        );
    }

    async touch(
        privatekey: string | Key,
        wallet: { wallet: AccountType, operation: Operation<CreateContractAccountFact> }
    ) {
        const op = wallet.operation
        op.sign(privatekey)

        return await getAPIData(() => api.operation.send(this.api, op.toHintedObject()))
    }

    async getContractInfo(address: string | Address) {
        const data = await getAPIData(() => api.account.getAccount(this.api, address))
        return data ? data._embedded : null
    }
}