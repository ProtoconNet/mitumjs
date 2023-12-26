import axios from "axios"
import { Big, IP } from "../types"

const delegateUri = (delegateIP: string | IP) => `${IP.from(delegateIP).toString()}?uri=`

async function getBlocks(api: string | IP, delegateIP: string | IP) {
    const apiPath = `${IP.from(api).toString()}/block/manifests`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getBlockByHeight(api: string | IP, height: string | number | Big, delegateIP: string | IP) {
    const apiPath = `${IP.from(api).toString()}/block/${Big.from(height).toString()}/manifest`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getBlockByHash(api: string | IP, hash: string, delegateIP: string | IP) {
    const apiPath = `${IP.from(api).toString()}/block/${hash}/manifest`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

export default {
    getBlocks,
    getBlockByHeight,
    getBlockByHash,
}