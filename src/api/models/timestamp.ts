import axios from "axios"

import { Address } from "../../key"
import { Big, IP } from "../../types"
import { delegateUri } from "../../utils"

const url = (
    api: string | IP, 
    contract: string | Address,
) => `${IP.from(api).toString()}/timestamp/${Address.from(contract).toString()}`

async function getModel(
    api: string | IP, 
    contract: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/service`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getTimeStamp(
    api: string | IP, 
    contract: string | Address,
    projectID: string,
    timestampIdx: string | number | Big,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/project/${projectID}/id/${Big.from(timestampIdx).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getModel,
    getTimeStamp,
}