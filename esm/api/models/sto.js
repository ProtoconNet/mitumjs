import axios from "axios";
import { Address } from "../../key";
import { IP } from "../../types";
const url = (api, contract) => `${IP.from(api).toString()}/sto/${Address.from(contract).toString()}`;
async function getService(api, contract) {
    return await axios.get(`${url(api, contract)}`);
}
async function getPartitions(api, contract, holder) {
    return await axios.get(`${url(api, contract)}/holder/${Address.from(holder).toString()}/partitions`);
}
async function getBalanceByHolder(api, contract, holder, partition) {
    return await axios.get(`${url(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/balance`);
}
async function getOperatorsByHolder(api, contract, holder, partition) {
    return await axios.get(`${url(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/operators`);
}
async function getPartitionBalance(api, contract, partition) {
    return await axios.get(`${url(api, contract)}/partition/${partition}/balance`);
}
async function getAuthorized(api, contract, operator) {
    return await axios.get(`${url(api, contract)}/operator/${Address.from(operator).toString()}/holders`);
}
export default {
    getService,
    getPartitions,
    getBalanceByHolder,
    getOperatorsByHolder,
    getPartitionBalance,
    getAuthorized,
};
//# sourceMappingURL=sto.js.map