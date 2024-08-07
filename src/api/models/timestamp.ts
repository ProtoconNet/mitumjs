import axios from "axios"
import { Address } from "../../key"
import { Big } from "../../types"
import { delegateUri } from "../../utils"

const url = (
    api: string | undefined, 
    contract: string | Address,
) => `${api}/timestamp/${Address.from(contract).toString()}`

async function getModel(
    api: string | undefined, 
    contract: string | Address,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getTimeStamp(
    api: string | undefined, 
    contract: string | Address,
    projectID: string,
    timestampIdx: string | number | Big,
    delegateIP: string | undefined
) {
    const apiPath = `${url(api, contract)}/project/${projectID}/idx/${Big.from(timestampIdx).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getModel,
    getTimeStamp,
}