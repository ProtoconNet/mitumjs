import axios from "axios";
import { IP } from "../../types";
import { CurrencyID } from "../../common";

const delegateAddress = "http://52.78.50.162:3398/v1/mitumt/delegate/call?uri=";

async function getCurrencies(api: string | IP, delegate?: boolean | undefined) {
  const apiPath = `${IP.from(api).toString()}/currency`;
  const encodedString = encodeURIComponent(apiPath);
  return !delegate
    ? await axios.get(apiPath)
    : await axios.get(delegateAddress + encodedString);
}

async function getCurrency(
  api: string | IP,
  currency: string | CurrencyID,
  delegate?: boolean | undefined
) {
  const apiPath = `${IP.from(api).toString()}/currency/${CurrencyID.from(
    currency
  ).toString()}`;
  const encodedString = encodeURIComponent(apiPath);
  return !delegate
    ? await axios.get(apiPath)
    : await axios.get(delegateAddress + encodedString);
}

export default {
  getCurrencies,
  getCurrency,
};
