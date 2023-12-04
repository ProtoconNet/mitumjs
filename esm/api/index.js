import account from "./account";
import block from "./block";
import node from "./node";
import operation from "./operation";
import models from "./models";
const currency = models.currency;
const contract = models.contract;
export { account, block, node, operation, currency, contract, };
export default {
    account,
    block,
    node,
    operation,
    currency,
    contract,
};
export async function getAPIData(f) {
    const res = await f();
    if (res.status !== 200) {
        return null;
    }
    return res.data;
}
//# sourceMappingURL=index.js.map