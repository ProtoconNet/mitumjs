import axios from "axios"
import { IP } from "../../types"
import { CurrencyID } from "../../common"
import { delegateUri } from "../../utils"

async function getCurrencies(api: string | IP, delegateIP: string | IP) {
    const apiPath = `${IP.from(api).toString()}/currency`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getCurrency(api: string | IP, currency: string | CurrencyID, delegateIP: string | IP) {
    const apiPath = `${IP.from(api).toString()}/currency/${CurrencyID.from(currency).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

export default {
    getCurrencies,
    getCurrency,
}