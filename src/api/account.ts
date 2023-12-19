import axios from "axios"
import { IP } from "../types";
import { Address, Key } from "../key";

const delegateAddress = "http://152.99.22.116:444/v1/mitumt/delegate/call?uri="

async function getAccount(api: string | IP, address: string | Address, delegate? : boolean | undefined) {
    const apiPath = `${IP.from(api).toString()}/account/${Address.from(address).toString()}`;
    const encodedString = encodeURIComponent(apiPath);
    return !delegate ? await axios.get(apiPath) : await axios.get(delegateAddress + encodedString) 
}

async function getAccountByPublicKey(api: string | IP, publicKey: string | Key, delegate? : boolean | undefined) {
    const apiPath = `${IP.from(api).toString()}/accounts?publickey=${Key.from(publicKey).toString()}`;
    const encodedString = encodeURIComponent(apiPath);
    return !delegate ? await axios.get(apiPath) : await axios.get(delegateAddress + encodedString) 
}

export default {
    getAccount,
    getAccountByPublicKey,
}