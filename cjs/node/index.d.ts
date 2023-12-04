import { Version, NetworkID, Config, RangeConfig } from "./config";
import { Generator, IP } from "../types";
export { Version, NetworkID, Config, RangeConfig, };
export declare class Node extends Generator {
    constructor(api?: string | IP);
    getNodeInfo(): Promise<import("axios").AxiosResponse<any, any>>;
}
export declare class Block extends Generator {
    constructor(api?: string | IP);
    getAllBlocks(): Promise<import("axios").AxiosResponse<any, any>>;
    getBlockByHash(hash: string): Promise<import("axios").AxiosResponse<any, any>>;
    getBlockByHeight(height: number | string): Promise<import("axios").AxiosResponse<any, any>>;
    getOperationsByHash(hash: string): Promise<import("axios").AxiosResponse<any, any>>;
    getOperationsByHeight(height: number | string): Promise<import("axios").AxiosResponse<any, any>>;
}
