import { RegisterModelFact } from "./register-model"
import { AddTemplateFact } from "./add-template"
import { IssueItem, IssueFact } from "./issue"
import { RevokeItem, RevokeFact } from "./revoke"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
import { Big, Bool, IP, ShortDate, TimeStamp, URIString } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

type templateData = {
    templateID: string
    templateName: string
    serviceDate: string | ShortDate
    expirationDate: string | ShortDate
    templateShare: boolean | Bool
    multiAudit: boolean | Bool
    displayName: string
    subjectKey: string
    description: string
    creator: string | Address
}

type issueData = {
    holder: string | Address,
    templateID: string,
    credentialID: string,
    value: string,
    validFrom: string | number | Big,
    validUntil: string | number | Big,
    did: string,
}

export class Credential extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }
    
    /**
     * Generate a `register-model` operation to register new credential model on the contract.
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
                TimeStamp.new().UTC(),
                sender,
                contract,
                currency,
            ),
        )
    }
    
    /**
     * Generate an `add-template` operation for adding a new credential template to the credential service.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {templateData} [data] - The template data to be added. The properties of `templateData` include:
     * - {string} `templateID` - The ID of the template.
     * - {string} `templateName` - The name of the template.
     * - {string | ShortDate} `serviceDate` - The service date.
     * - {string | ShortDate} `expirationDate` - The expiration date.
     * - {boolean | Bool} `templateShare` - Indicates whether the template is shareable.
     * - {boolean | Bool} `multiAudit` - Indicates whether multi-audit is enabled.
     * - {string} `displayName` - The display name of the template.
     * - {string} `subjectKey` - The subject key of the template.
     * - {string} `description` - The description of the template.
     * - {string | Address} `creator` - The address of the creator of the template.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns An `add-template` operation.
     */
    addTemplate(
        contract: string | Address,
        sender: string | Address,
        data: templateData,
        currency: string | CurrencyID,
    ) {
        const keysToCheck: (keyof templateData)[] = ['templateID', 'templateName', 'serviceDate', 'expirationDate', 'templateShare', 'multiAudit', 'displayName', 'subjectKey', 'description', 'creator'];
        keysToCheck.forEach((key) => {
            const s = data[key];
            Assert.check(
                s !== undefined, 
                MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the templateData structure`)
            )
        });
        new URIString(data['templateID'], 'templateID');

        return new Operation(
            this.networkID,
            new AddTemplateFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                data.templateID,
                data.templateName,
                data.serviceDate,
                data.expirationDate,
                data.templateShare,
                data.multiAudit,
                data.displayName,
                data.subjectKey,
                data.description,
                data.creator,
                currency,
            )
        )
    }
    
    /**
     * Generate an `issue` operation for issue credential to holder.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {issueData} [data] - The data required for issuing the credential. The properties of `issueData` include:
     * - {string | Address} `holder` - The address of the credential holder.
     * - {string} `templateID` - The ID of the template.
     * - {string} `credentialID` - The ID of the credential.
     * - {string} `value` - The value of the credential.
     * - {string | number | Big} `validFrom` - The timestamp for validFrom.
     * - {string | number | Big} `validUntil` - The timestamp for validUntil.
     * - {string} `did` - The Decentralized Identifier (DID) associated with the credential.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `issue` operation.
     */
    issue(
        contract: string | Address,
        sender: string | Address,
        data: issueData,
        currency: string | CurrencyID,
    ) {
        const keysToCheck: (keyof issueData)[] = ['holder', 'templateID', 'credentialID', 'value', 'validFrom', 'validUntil', 'did'];
        keysToCheck.forEach((key) => {
            const s = data[key];
            Assert.check(
                s !== undefined, 
                MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the templateData structure`)
            )
        });
        new URIString(data['templateID'], 'templateID');
        new URIString(data['credentialID'], 'credentialID');

        return new Operation(
            this.networkID,
            new IssueFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new IssueItem(
                        contract,
                        data.holder,
                        data.templateID,
                        data.credentialID,
                        data.value,
                        data.validFrom,
                        data.validUntil,
                        data.did,
                        currency,
                    )
                ]
            )
        )
    }
    
    /**
     * Generate an `revoke` operation to revoke already issued credential.
     * @param {string | Address} contract - The contract's address.
     * @param {string | Address} sender - The sender's address.
     * @param {string | Address} holder - The holder's address of the credential to be revoked.
     * @param {string} templateID - The ID of the template associated with the credential.
     * @param {string} credentialID - The ID of the credential to be revoked.
     * @param {string | CurrencyID} currency - The currency ID.
     * @returns `revoke` operation.
     */
    revoke(
        contract: string | Address,
        sender: string | Address,
        holder: string | Address,
        templateID: string,
        credentialID: string,
        currency: string | CurrencyID,
    ) {
        new URIString(templateID, 'templateID');
        new URIString(credentialID, 'credentialID');

        return new Operation(
            this.networkID,
            new RevokeFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new RevokeItem(
                        contract,
                        holder,
                        templateID,
                        credentialID,
                        currency,
                    )
                ]
            )
        )
    }
    
    /**
     * Get information about a credential model on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is credential service information:
     * - `_hint`: Hint for credential design,
     * - `policy`:
     * - - `_hint`: Hint for credential policy,
     * - - `templates`: Array of name of templates,
     * - - `holders`: Array of holder object 
     * - - - `_hint`: Hint for holder,
     * - - - `address`: Address of holder,
     * - - - `credential_count`: The number of credential for the holder
     * - - `credential_count`: The total number of credential
     */
    async getModelInfo(contract: string | Address) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.credential.getModel(this.api, contract, this.delegateIP))
    }
    
    /**
     * Get detailed information about a specific credential on the template.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [templateID] - The ID of the template associated with the credential.
     * @param {string} [credentialID] - The unique ID of the credential.
     * @returns `data` of `SuccessResponse` is credential information:
     * - `credential`:
     * - - `_hint`: Hint for credential,
     * - - `holder`: Address of holder,
     * - - `template_id`: The id for the template,
     * - - `credential_id`: The id for the credential,
     * - - `value`: The value of credential,
     * - - `valid_from`: The timestamp for valid_from,
     * - - `valid_until`: The timestamp for valid_until,
     * - - `did`: The name of the credential,
     * - `is_active`: Indicates whether the credential is active or revoked
     */
    async getCredential(
        contract: string | Address,
        templateID: string,
        credentialID: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(templateID, 'templateID');
        new URIString(credentialID, 'credentialID');
        return await getAPIData(() => contractApi.credential.getCredential(this.api, contract, templateID, credentialID, this.delegateIP))
    }
    
    /**
     * Get information about a specific template on the credential service.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [templateID] - The ID of the template.
     * @returns `data` of `SuccessResponse` is template information:
     * - `_hint`: Hint for credential template,
     * - `template_id`: The ID of the template.- `template_name`: Name for template,
     * - `service_date`: The service date.
     * - `expiration_date`: The expiration date.
     * - `template_share`: Indicates whether the template is shareable.
     * - `multi_audit`: Indicates whether multi-audit is enabled.
     * - `display_name`: The display name of the template.
     * - `subject_key`: The description of the template.
     * - `description`: The description of the template.
     * - `creator`: The address of the creator of the template.
     */
    async getTemplate(
        contract: string | Address,
        templateID: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(templateID, 'templateID');
        return await getAPIData(() => contractApi.credential.getTemplate(this.api, contract, templateID, this.delegateIP))
    }
    
    /**
     * Get information about all credentials on the template.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [templateID] - The ID of the template.
     * @returns `data` of `SuccessResponse` is array of the all credential informations of the template:
     * - `_hint`: Hint for currency,
     * - `_embedded`:
     * - - `credential`:
     * - - - `_hint`: Hint for credential,
     * - - - `holder`: Address of holder,
     * - - - `template_id`: The id for the template,
     * - - - `credential_id`: The id for the credential,
     * - - - `value`: The value of credential,
     * - - - `valid_from`: The timestamp for valid_from,
     * - - - `valid_until`: The timestamp for valid_until,
     * - - - `did`: The name of the credential,
     * - - `is_active`: Indicates whether the credential is active or revoked,
     * - `_links`: links to get additional information of the credential,
     */
    async getAllCredentials(
        contract: string | Address,
        templateID: string,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(templateID, 'templateID');
        return await getAPIData(() => contractApi.credential.getCredentials(this.api, contract, templateID, this.delegateIP))
    }
    
    /**
     * Get all credentials owned by the holder in the credential service.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [holder] - The holder's address claiming the credentials.
     * @returns `data` of `SuccessResponse` is a object with all credential information owned by the holder:
     * - `did`: The did value of the most recently issued credential,
     * - `credentials`: Array of all credential information owned by the holder: {
     * - - `_hint`: Hint for currency,
     * - - `_embedded`:
     * - - - `credential`:
     * - - - - `_hint`: Hint for credential,
     * - - - - `holder`: Address of holder,
     * - - - - `template_id`: The id for the template,
     * - - - - `credential_id`: The id for the credential,
     * - - - - `value`: The value of credential,
     * - - - - `valid_from`: The timestamp for valid_from,
     * - - - - `valid_until`: The timestamp for valid_until,
     * - - - - `did`: The name of the credential,
     * - - - `is_active`: Indicates whether the credential is active or revoked,
     * - - `_links`: links to get additional information of the credential
     */
    async getByHolder(
        contract: string | Address,
        holder: string | Address,
    ) {
        Assert.check( this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Address.from(holder);
        return await getAPIData(() => contractApi.credential.getCredentialByHolder(this.api, contract, holder, this.delegateIP))
    }
}