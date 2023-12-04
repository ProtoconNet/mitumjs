import axios from "axios";
import { Address } from "../../key";
import { Big, IP } from "../../types";
const url = (api, contract) => `${IP.from(api).toString()}/timestamp/${Address.from(contract).toString()}`;
async function getService(api, contract) {
    return await axios.get(`${url(api, contract)}/service`);
}
async function getTimeStamp(api, contract, projectID, tid) {
    return await axios.get(`${url(api, contract)}/project/${projectID}/id/${Big.from(tid).toString()}`);
}
export default {
    getService,
    getTimeStamp,
};
//# sourceMappingURL=timestamp.js.map