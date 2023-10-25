import axios from "axios"

import { Address } from "../../key"
import { IP } from "../../types"

const url = (
    api: string | IP, 
    contract: string | Address, 
) => `${IP.from(api).toString()}/point/${Address.from(contract).toString()}`

async function getPoint(
    api: string | IP,
    contract: string | Address,
) {
    return await axios.get(`${url(api, contract)}`)
}

async function getPointBalance(
    api: string | IP,
    contract: string | Address,
    account: string | Address,
) {
    return await axios.get(`${url(api, contract)}/account/${Address.from(account).toString()}`)
}

export default {
    getPoint,
    getPointBalance,
}