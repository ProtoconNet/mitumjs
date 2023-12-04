import axios from "axios";
import { Address } from "../key";
import { Big, IP } from "../types";
async function getOperations(api) {
    return await axios.get(`${IP.from(api).toString()}/block/operations`);
}
async function getOperation(api, hash) {
    return await axios.get(`${IP.from(api).toString()}/block/operation/${hash}`);
}
async function getBlockOperationsByHeight(api, height) {
    return await axios.get(`${IP.from(api).toString()}/block/${Big.from(height).toString()}/operations`);
}
async function getBlockOperationsByHash(api, hash) {
    return await axios.get(`${IP.from(api).toString()}/block/${hash}/operations`);
}
async function getAccountOperations(api, address) {
    return await axios.get(`${IP.from(api).toString()}/account/${Address.from(address).toString()}/operations`);
}
async function send(api, operation, config) {
    return await axios.post(`${IP.from(api).toString()}/builder/send`, JSON.stringify(operation), config);
}
export default {
    getOperations,
    getOperation,
    getBlockOperationsByHeight,
    getBlockOperationsByHash,
    getAccountOperations,
    send,
};
//# sourceMappingURL=operation.js.map