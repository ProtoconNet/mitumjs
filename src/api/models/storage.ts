import axios from "axios"
import { Address } from "../../key/address"
import { delegateUri, apiPathWithParams } from "../../utils"

const url = (
    api: string | undefined, 
    contract: string | Address,
) => `${api}/storage/${Address.from(contract).toString()}`

async function getModel(
    api: string | undefined, 
    contract: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getData(
    api: string | undefined, 
    contract: string | Address,
    dataKey: string,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/datakey/${dataKey}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getDataHistory(
    api: string | undefined, 
    contract: string | Address,
    dataKey: string,
    delegateIP: string | undefined,
    limit?: number, offset?: number, reverse?: true
) {
    const apiPath = apiPathWithParams(`${url(api, contract)}/datakey/${dataKey}/history`, limit, offset, reverse);
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getDataCount(
    api: string | undefined, 
    contract: string | Address,
    delegateIP: string | undefined,
    deleted?: true
) {
    const apiPath = `${url(api, contract)}/datacount?deleted=${deleted ? 1 : 0}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getModel,
    getData,
    getDataHistory,
    getDataCount
}