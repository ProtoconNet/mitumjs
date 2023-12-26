import axios from "axios"
import { IP } from "../types"

const delegateUri = (delegateIP: string | IP) => `${IP.from(delegateIP).toString()}?uri=`

async function getNode(api: string | IP, delegateIP: string | IP) {
    const apiPath = `${IP.from(api).toString()}/`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

export default {
    getNode,
}