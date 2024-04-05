import axios from "axios"
import { IP } from "../types"
import { delegateUri } from "../utils/apiPathUtils"

async function getNode(api: string | IP, delegateIP: string | IP) {
    const apiPath = `${IP.from(api).toString()}/`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

export default {
    getNode,
}