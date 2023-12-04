import { IP } from "./string";
export declare abstract class Generator {
    protected _networkID: string;
    protected _api: IP | undefined;
    protected constructor(networkID: string, api?: string | IP);
    /**
     * @deprecated use setNetworkID(networkID: string)
     */
    setChainID(networkID: string): void;
    setNetworkID(networkID: string): void;
    /**
     * @deprecated use setAPI(api?: string | IP)
     */
    setNode(api?: string | IP): void;
    setAPI(api?: string | IP): void;
    get networkID(): string;
    get api(): string;
}
