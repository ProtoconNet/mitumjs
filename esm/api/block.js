import axios from "axios";
import { Big, IP } from "../types";
async function getBlocks(api) {
    return await axios.get(`${IP.from(api).toString()}/block/manifests`);
}
async function getBlockByHeight(api, height) {
    return await axios.get(`${IP.from(api).toString()}/block/${Big.from(height).toString()}/manifest`);
}
async function getBlockByHash(api, hash) {
    return await axios.get(`${IP.from(api).toString()}/block/${hash}/manifest`);
}
export default {
    getBlocks,
    getBlockByHeight,
    getBlockByHash,
};
//# sourceMappingURL=block.js.map