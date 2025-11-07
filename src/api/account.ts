import axios from "axios"
import { Address } from "../key/address";
import { Key } from "../key/pub";
import { delegateUri } from "../utils"

async function getAccount(api: string | undefined, address: string | Address, delegateIP: string | undefined) {
    const apiPath = `${api}/account/${Address.from(address).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getAccountByPublicKey(api: string | undefined, publicKey: string | Key, delegateIP: string | undefined) {
    const apiPath = `${api}/accounts?publickey=${Key.from(publicKey).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

export default {
    getAccount,
    getAccountByPublicKey,
}