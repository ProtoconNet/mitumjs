import axios from "axios";
import { IP } from "../types";
async function getNode(api) {
    return await axios.get(`${IP.from(api).toString()}/`);
}
export default {
    getNode,
};
//# sourceMappingURL=node.js.map