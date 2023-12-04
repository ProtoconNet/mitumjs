import { IP } from "../types";
declare function getNode(api: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getNode: typeof getNode;
};
export default _default;
