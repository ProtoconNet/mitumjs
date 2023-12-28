import axios from "axios"

import { Address } from "../../key"
import { IP } from "../../types"

const url = (
    api: string | IP, 
    contract: string | Address, 
) => `${IP.from(api).toString()}/token/${Address.from(contract).toString()}`

const delegateUri = (delegateIP: string | IP) => `${IP.from(delegateIP).toString()}?uri=`

async function getToken(
    api: string | IP,
    contract: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

async function getTokenBalance(
    api: string | IP,
    contract: string | Address,
    account: string | Address,
    delegateIP: string | IP
) {
    const apiPath = `${url(api, contract)}/account/${Address.from(account).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath)) 
}

export default {
    getToken,
    getTokenBalance,
}