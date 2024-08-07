import axios from "axios"
import { delegateUri } from "../utils"

async function getNode(api: string | undefined, delegateIP: string | undefined) {
    const apiPath = `${api}/`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

export default {
    getNode,
}