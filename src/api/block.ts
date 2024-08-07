import axios from "axios"
import { Big } from "../types"
import { delegateUri, apiPathWithParams } from "../utils"

async function getBlocks(
    api: string | undefined,
    delegateIP: string | undefined,
    limit?: number, offset?: number, reverse?: true
) {
    const apiPath = apiPathWithParams(`${api}/block/manifests`, limit, offset, reverse);
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getBlockByHeight(api: string | undefined, height: string | number | Big, delegateIP: string | undefined) {
    const apiPath = `${api}/block/${Big.from(height).toString()}/manifest`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getBlockByHash(api: string | undefined, hash: string, delegateIP: string | undefined) {
    const apiPath = `${api}/block/${hash}/manifest`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

export default {
    getBlocks,
    getBlockByHeight,
    getBlockByHash,
}