import axios from "axios"
import { CurrencyID } from "../../common"
import { delegateUri } from "../../utils"

async function getCurrencies(api: string | undefined, delegateIP: string | undefined) {
    const apiPath = `${api}/currency`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

async function getCurrency(api: string | undefined, currency: string | CurrencyID, delegateIP: string | undefined) {
    const apiPath = `${api}/currency/${CurrencyID.from(currency).toString()}`;
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
}

export default {
    getCurrencies,
    getCurrency,
}