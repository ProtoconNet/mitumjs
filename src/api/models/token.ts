import axios from "axios";

import { Address } from "../../key";
import { IP } from "../../types";

const url = (api: string | IP, contract: string | Address) =>
  `${IP.from(api).toString()}/token/${Address.from(contract).toString()}`;

async function getToken(api: string | IP, contract: string | Address) {
  return await axios.get(`${url(api, contract)}`);
}

async function getTokenBalance(
  api: string | IP,
  contract: string | Address,
  account: string | Address,
  delegate: boolean | undefined
) {
  const delegateAddress =
    "http://52.78.50.162:3398/v1/mitumt/delegate/call?uri=";
  const apiPath = `${url(api, contract)}/account/${Address.from(
    account
  ).toString()}`;
  const encodedString = encodeURIComponent(apiPath);
  return !delegate
    ? await axios.get(apiPath)
    : await axios.get(delegateAddress + encodedString);
}

export default {
  getToken,
  getTokenBalance,
};
