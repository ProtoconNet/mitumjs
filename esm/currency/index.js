import { isIPAddress } from "../utils/validation.js";
import { TimeStamp } from "../utils/time.js";
import { OperationType } from "../types/operation.js";
import { Amount } from "../types/property.js";
import { CurrencyPolicyUpdaterFact } from "./updatePolicy.js";
import { TransfersFact, TransfersItem } from "./transfer.js";
import { CurrencyRegisterFact } from "./register.js";
import currencyInfo from "./information.js";
import { NilFeeer, FixedFeeer, RatioFeeer, CurrencyPolicy, CurrencyDesign, } from "./design.js";
import { SuffrageInflationFact, SuffrageInflationItem } from "./inflate.js";
export class Currency {
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
    async getAllCurrencies() {
        return await currencyInfo.getAllCurrencyInfo(this._node);
    }
    async getCurrency(currencyID) {
        return await currencyInfo.getCurrencyInfo(this._node, currencyID);
    }
    /** structure
     * inputData = {
     *    currencyID: string;
     *    genesisAddress: string;
     *    totalSupply: number;
     *    minBalance: number;
     *    feeType: feeType; // "none" or "fixed" or "ratio"
     *    feeReceiver?: string; // receiver address
     *    fee?: number; // case of "fixed" fee or ratio
     *    minFee?: number;
     *    maxFee?: number;
     * }
     */
    create(data) {
        const feePolicy = this.setFeePolicy(data.feeType, data.feeReceiver, data.fee, data.minFee, data.maxFee);
        const policy = new CurrencyPolicy(data.minBalance, feePolicy);
        if (data.totalSupply === undefined || data.genesisAddress === undefined) {
            throw new Error("The values for the 'totalSupply' or 'genesisAddress' fields were not entered.");
        }
        const amount = new Amount(data.currencyID, data.totalSupply);
        const design = new CurrencyDesign(amount, data.genesisAddress, policy);
        const token = new TimeStamp().UTC();
        const fact = new CurrencyRegisterFact(token, design);
        return new OperationType(this._networkID, fact);
    }
    /** structure
     * inputData = {
     *    currencyID: string;
     *    minBalance: number;
     *    feeType: feeType; // "none" or "fixed" or "ratio"
     *    feeReceiver?: string; // receiver address
     *    fee?: number; // case of "fixed" fee or ratio
     *    minFee?: number;
     *    maxFee?: number;
     * }
     */
    setPolicy(data) {
        const feePolicy = this.setFeePolicy(data.feeType, data.feeReceiver, data.fee, data.minFee, data.maxFee);
        const policy = new CurrencyPolicy(data.minBalance, feePolicy);
        const token = new TimeStamp().UTC();
        const fact = new CurrencyPolicyUpdaterFact(token, data.currencyID, policy);
        return new OperationType(this._networkID, fact);
    }
    setFeePolicy(feeType, feeReceiver, fee, minFee, maxFee) {
        let feePolicy;
        if (feeType === "none") {
            feePolicy = new NilFeeer();
        }
        else if (feeType === "fixed" &&
            feeReceiver !== undefined &&
            fee !== undefined) {
            feePolicy = new FixedFeeer(feeReceiver, fee);
        }
        else if (feeType === "ratio" &&
            feeReceiver !== undefined &&
            fee !== undefined &&
            minFee !== undefined &&
            maxFee !== undefined) {
            feePolicy = new RatioFeeer(feeReceiver, fee, minFee, maxFee);
        }
        else {
            throw new Error("The fee-type and its fields-value were not entered correctly.");
        }
        return feePolicy;
    }
    transfer(sender, receiver, currencyID, amount) {
        const tokenAmount = new Amount(currencyID, amount);
        const token = new TimeStamp().UTC();
        const item = new TransfersItem(receiver, [tokenAmount]);
        const fact = new TransfersFact(token, sender, [item]);
        return new OperationType(this._networkID, fact);
    }
    mint(receiver, currencyID, amount) {
        const tokenAmount = new Amount(currencyID, amount);
        const token = new TimeStamp().UTC();
        const item = new SuffrageInflationItem(receiver, tokenAmount);
        const fact = new SuffrageInflationFact(token, [item]);
        return new OperationType(this._networkID, fact);
    }
}
//# sourceMappingURL=index.js.map