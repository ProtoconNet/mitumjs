import axios from "axios"

import { Address } from "../../key"
import { IP } from "../../types"
import { delegateUri } from "../../utils/apiPathUtils"

const url = (
    api: string | IP, 
    contract: string | Address, 
) => `${IP.from(api).toString()}/point/${Address.from(contract).toString()}`

async function getPoint(
    api: string | IP,
    contract: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getPointBalance(
    api: string | IP,
    contract: string | Address,
    account: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/account/${Address.from(account).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getPoint,
    getPointBalance,
}