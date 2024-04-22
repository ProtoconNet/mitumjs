import axios from "axios"
import { IP } from "../types";
import { Address, Key } from "../key";
import { delegateUri } from "../utils"

async function getAccount(api: string | IP, address: string | Address, delegateIP: string | IP) {
    const apiPath = `${IP.from(api).toString()}/account/${Address.from(address).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getAccountByPublicKey(api: string | IP, publicKey: string | Key, delegateIP: string | IP) {
    const apiPath = `${IP.from(api).toString()}/accounts?publickey=${Key.from(publicKey).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

export default {
    getAccount,
    getAccountByPublicKey,
}