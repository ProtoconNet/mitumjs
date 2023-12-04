import { CreateAccountFact } from "./create-account";
import { UpdateKeyFact } from "./update-key";
import { TransferFact } from "./transfer";
import { CreateContractAccountFact } from "./create-contract-account";
import { WithdrawFact } from "./withdraw";
import { UpdateOperatorFact } from "./update-operator";
import { RegisterCurrencyFact } from "./register-currency";
import { UpdateCurrencyFact } from "./update-currency";
import { MintFact } from "./mint";
import { Operation } from "../base";
import { CurrencyID } from "../../common";
import { Big, Generator, IP } from "../../types";
import { Address, Key, PubKey, Account as AccountType, KeyG } from "../../key";
type createData = {
    currency: string | CurrencyID;
    genesisAddress: string | Address;
    totalSupply: string | number | Big;
    minBalance: string | number | Big;
    feeType: "nil" | "fixed" | "ratio";
    feeReceiver: string | Address;
    fee?: string | number | Big;
    ratio?: number;
    minFee?: string | number | Big;
    maxFee?: string | number | Big;
};
type keysType = ({
    key: string | Key | PubKey;
    weight: string | number | Big;
} | PubKey)[] | Array<{
    key: string | Key | PubKey;
    weight: string | number | Big;
}>;
export declare class Currency extends Generator {
    constructor(networkID: string, api?: string | IP);
    create(data: createData): Operation<RegisterCurrencyFact>;
    setPolicy(data: createData): Operation<UpdateCurrencyFact>;
    private buildPolicy;
    transfer(sender: string | Address, receiver: string | Address, currency: string | CurrencyID, amount: string | number | Big): Operation<TransferFact>;
    withdraw(sender: string | Address, target: string | Address, currency: string | CurrencyID, amount: string | number | Big): Operation<WithdrawFact>;
    mint(receiver: string | Address, currency: string | CurrencyID, amount: number): Operation<MintFact>;
    getAllCurrencies(): Promise<string[] | null>;
    getCurrency(cid: string | CurrencyID): Promise<any>;
}
export declare class Account extends KeyG {
    constructor(networkID: string, api?: string | IP);
    createWallet(sender: string | Address, currency: string | CurrencyID, amount: string | number | Big, seed?: string, weight?: string | number | Big): {
        wallet: AccountType;
        operation: Operation<CreateAccountFact>;
    };
    createEtherWallet(sender: string | Address, currency: string | CurrencyID, amount: string | number | Big, seed?: string, weight?: string | number | Big): {
        wallet: AccountType;
        operation: Operation<CreateAccountFact>;
    };
    createAccount(sender: string | Address, key: string | Key | PubKey, currency: string | CurrencyID, amount: string | number | Big): Operation<CreateAccountFact>;
    createEtherAccount(sender: string | Address, key: string | Key | PubKey, currency: string | CurrencyID, amount: string | number | Big): Operation<CreateAccountFact>;
    createMultiSig(sender: string | Address, keys: keysType, currency: string | CurrencyID, amount: string | number | Big, threshold: string | number | Big): Operation<CreateAccountFact>;
    createEtherMultiSig(sender: string | Address, keys: keysType, currency: string | CurrencyID, amount: string | number | Big, threshold: string | number | Big): Operation<CreateAccountFact>;
    update(target: string | Address, newKey: string | Key | PubKey, currency: string | CurrencyID): Operation<UpdateKeyFact>;
    updateMultiSig(target: string | Address, newKeys: keysType, currency: string | CurrencyID, threshold: string | number | Big): Operation<UpdateKeyFact>;
    getMultiSigAddress(keys: keysType, threshold: string | number | Big): string;
    touch(privatekey: string | Key, wallet: {
        wallet: AccountType;
        operation: Operation<CreateAccountFact>;
    }): Promise<any>;
    getAccountInfo(address: string | Address): Promise<any>;
    getOperations(address: string | Address): Promise<any>;
    getByPublickey(publickey: string | Key | PubKey): Promise<any>;
    balance(address: string | Address): Promise<any>;
}
export declare class Contract extends Generator {
    constructor(networkID: string, api?: string | IP);
    createWallet(sender: string | Address, currency: string | CurrencyID, amount: string | number | Big, seed?: string, weight?: string | number | Big): {
        wallet: AccountType;
        operation: Operation<CreateContractAccountFact>;
    };
    createEtherWallet(sender: string | Address, currency: string | CurrencyID, amount: string | number | Big, seed?: string, weight?: string | number | Big): {
        wallet: AccountType;
        operation: Operation<CreateContractAccountFact>;
    };
    createAccount(sender: string | Address, key: string | Key | PubKey, currency: string | CurrencyID, amount: string | number | Big): Operation<CreateContractAccountFact>;
    createEtherAccount(sender: string | Address, key: string | Key | PubKey, currency: string | CurrencyID, amount: string | number | Big): Operation<CreateContractAccountFact>;
    createMultiSig(sender: string | Address, keys: keysType, currency: string | CurrencyID, amount: string | number | Big, threshold: string | number | Big): Operation<CreateContractAccountFact>;
    createEtherMultiSig(sender: string | Address, keys: keysType, currency: string | CurrencyID, amount: string | number | Big, threshold: string | number | Big): Operation<CreateContractAccountFact>;
    updateOperator(sender: string | Address, contract: string | Address, currency: string | CurrencyID, operators: (string | Address)[]): Operation<UpdateOperatorFact>;
    touch(privatekey: string | Key, wallet: {
        wallet: AccountType;
        operation: Operation<CreateContractAccountFact>;
    }): Promise<any>;
    getContractInfo(address: string | Address): Promise<any>;
}
export {};
