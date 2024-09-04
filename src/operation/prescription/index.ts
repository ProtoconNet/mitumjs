import { RegisterModelFact } from "./resgister-model"
import { RegisterPrescriptionFact } from "./register-prescription"
import { UsePrescriptionFact } from "./use-prescription"
import { ContractGenerator, Operation } from "../base"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
import { IP, TimeStamp as TS, URIString, Big, LongString } from "../../types"
import { Assert, MitumError, ECODE } from "../../error"

export class Prescription extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }
    
    /**
     * Generate a `register-model` operation to register new prescription model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(
        contract: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RegisterModelFact(
                TS.new().UTC(),
                sender,
                contract,
                currency,
            )
        )
    }

    /**
     * Generate `register-prescription` operation to register a new prescription.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [prescriptionHash] - The hash value of the prescription.
     * @param {string | number | Big} [prescribeDate] - Time when the prescription is registered.
     * @param {string | number | Big} [endDate] - Time when the prescription expires.
     * @param {string | LongString} [hospital] - Name of hospital that issued prescription.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-prescription` operation
     */
    registerPrescription(
        contract: string | Address,
        sender: string | Address,
        prescriptionHash: string,
        prescribeDate: string | number | Big,
        endDate: string | number | Big,
        hospital: string | LongString,
        currency: string | CurrencyID,
    ) {
        new URIString(prescriptionHash, 'prescriptionHash');
        const fact = new RegisterPrescriptionFact(
            TS.new().UTC(),
            sender,
            contract,
            prescriptionHash,
            prescribeDate,
            endDate,
            hospital,
            currency,
        )

        return new Operation(this.networkID, fact)
    }

    /**
     * Generate `use-prescription` operation to use the prescription to prepare the medicine.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [prescriptionHash] - The hash value of the prescription to use.
     * @param {string | number | Big} [prepareDate] - Time when the prescription is used.
     * @param {string | LongString} [pharmacy] - Name of pharmacy that use the prescription.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `use-prescription` operation
     */
    usePrescription(
        contract: string | Address,
        sender: string | Address,
        prescriptionHash: string,
        prepareDate: string | number | Big,
        pharmacy: string | LongString,
        currency: string | CurrencyID,
    ) {
        new URIString(prescriptionHash, 'prescriptionHash');
        const fact = new UsePrescriptionFact(
            TS.new().UTC(),
            sender,
            contract,
            prescriptionHash,
            prepareDate,
            pharmacy,
            currency,
        )

        return new Operation(this.networkID, fact)
    }

    /**
     * Get information about a prescription model on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the prescription service:
     * - `_hint`: Hint for prescription design,
     */
    async getModelInfo(contract: string | Address) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.prescription.getModel(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get detailed information about a specific prescription with given hash.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [prescriptionHash] - The hash value of the prescription to search.
     * @returns `data` of `SuccessResponse` is information about the prescription:
     * - `_hint`: Hint for prescription data design,
     * - `prescription_hash`: The hash value associated with the prescription,
     * - `prescribe_date`: Time when the prescription is registered.,
     * - `prepare_date`: Time when the prescription is used, If the prescription has not yet been used, it's 0.
     * - `end_date`: Time when the prescription expires,
     * - `status`: 'Registered' or 'Used',
     * - `hospital`: The name of hospital,
     * - `pharmacy`: The name of pharmacy, If the prescription has not yet been used, it's empty string.
     */
    async getPrescription(
        contract: string | Address,
        prescriptionHash: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(prescriptionHash, 'prescriptionHash');
        return await getAPIData(() => contractApi.prescription.getPrescription(this.api, contract, prescriptionHash, this.delegateIP))
    }
}