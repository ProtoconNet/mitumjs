import { CreateServiceFact } from "./create-service"
import { AddTemplateFact } from "./add-template"
import { AssignItem, AssignFact } from "./assign"
import { RevokeItem, RevokeFact } from "./revoke"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contract, getAPIData } from "../../api"
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
    id: string,
    value: string,
    validFrom: string | number | Big,
    validUntil: string | number | Big,
    did: string,
}

export class Credential extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }

    createService(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new CreateServiceFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
            ),
        )
    }

    addTemplate(
        contractAddr: string | Address,
        sender: string | Address,
        data: templateData,
        currency: string | CurrencyID,
    ) {
        const keysToCheck: (keyof templateData)[] = ['templateID', 'templateName', 'serviceDate', 'expirationDate', 'templateShare', 'multiAudit', 'displayName', 'subjectKey', 'description', 'creator'];
        keysToCheck.forEach((key) => {
            const s = data[key];
            Assert.check(s !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the templateData structure`))
            s === 'templateID' ? new URIString(s, 'templateID') : null;
        });

        return new Operation(
            this.networkID,
            new AddTemplateFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
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

    issue(
        contractAddr: string | Address,
        sender: string | Address,
        data: issueData,
        currency: string | CurrencyID,
    ) {
        const keysToCheck: (keyof issueData)[] = ['holder', 'templateID', 'id', 'value', 'validFrom', 'validUntil', 'did'];
        keysToCheck.forEach((key) => {
            const s = data[key];
            Assert.check(s !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the templateData structure`))
            s === 'id' ? new URIString(s, 'id') : null;
        });
        return new Operation(
            this.networkID,
            new AssignFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new AssignItem(
                        contractAddr,
                        data.holder,
                        data.templateID,
                        data.id,
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

    revoke(
        contractAddr: string | Address,
        sender: string | Address,
        holder: string | Address,
        templateID: string,
        id: string,
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new RevokeFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new RevokeItem(
                        contractAddr,
                        holder,
                        templateID,
                        id,
                        currency,
                    )
                ]
            )
        )
    }

    async getServiceInfo(contractAddr: string | Address) {
        return await getAPIData(() => contract.credential.getIssuer(this.api, contractAddr))
    }

    async getCredentialInfo(
        contractAddr: string | Address,
        templateID: string,
        credentialID: string,
    ) {
        return await getAPIData(() => contract.credential.getCredential(this.api, contractAddr, templateID, credentialID))
    }

    async getTemplate(
        contractAddr: string | Address,
        templateID: string,
    ) {
        return await getAPIData(() => contract.credential.getTemplate(this.api, contractAddr, templateID))
    }

    async getAllCredentials(
        contractAddr: string | Address,
        templateID: string,
    ) {
        return await getAPIData(() => contract.credential.getCredentials(this.api, contractAddr, templateID))
    }

    async claimCredential(
        contractAddr: string | Address,
        holder: string | Address,
    ) {
        return await getAPIData(() => contract.credential.getCredentialByHolder(this.api, contractAddr, holder))
    }
}