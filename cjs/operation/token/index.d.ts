import { RegisterTokenFact } from "./register-token";
import { MintFact } from "./mint";
import { BurnFact } from "./burn";
import { TransferFact } from "./transfer";
import { ApproveFact } from "./approve";
import { TransferFromFact } from "./transfer-from";
import { ContractGenerator, Operation } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { Big, IP, LongString } from "../../types";
export declare class Token extends ContractGenerator {
    constructor(networkID: string, api?: string | IP);
    registerToken(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID, name: string | LongString, symbol: string | CurrencyID, initialSupply?: string | number | Big): Operation<RegisterTokenFact>;
    mint(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID, receiver: string | Address, amount: string | number | Big): Operation<MintFact>;
    burn(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID, target: string | Address, amount: string | number | Big): Operation<BurnFact>;
    transfer(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID, receiver: string | Address, amount: string | number | Big): Operation<TransferFact>;
    transferFrom(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID, receiver: string | Address, target: string | Address, amount: string | number | Big): Operation<TransferFromFact>;
    approve(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID, approved: string | Address, amount: string | number | Big): Operation<ApproveFact>;
    getTokenInfo(contractAddr: string | Address): Promise<any>;
    getAllowance(contractAddr: string | Address, owner: string | Address, spender: string | Address): Promise<{
        amount: any;
    } | null | undefined>;
    getTokenBalance(contractAddr: string | Address, owner: string | Address): Promise<any>;
}
