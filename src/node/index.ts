import { Version, NetworkID, Config, RangeConfig } from "./config"

import { block, node, operation } from "../api"
import { Generator, IP } from "../types"
import { Assert, ECODE, MitumError } from "../error"
import { getAPIData } from "../api"

export {
    Version, NetworkID,
    Config,
    RangeConfig,
}

export class Node extends Generator {
    constructor(api?: string | IP, delegateIP?: string | IP) {
        super("", api, delegateIP)
    }

    async getNodeInfo() {
        Assert.check(
            this.api !== undefined || this.api !== null,
            MitumError.detail(ECODE.NO_API, "no api"),
        )
        return await getAPIData(() => node.getNode(this.api, this.delegateIP))
    }
}

export class Block extends Generator {
    constructor(api?: string | IP, delegateIP?: string | IP) {
        super("", api, delegateIP)
    }

    async getAllBlocks(limit?: number, offset?: number, reverse?: true) {
        Assert.check(
            this.api !== undefined || this.api !== null,
            MitumError.detail(ECODE.NO_API, "no api"),
        )
        return await getAPIData(() => block.getBlocks(this.api, this.delegateIP, limit, offset, reverse))
    }

    async getBlockByHash(hash: string) {
        Assert.check(
            this.api !== undefined || this.api !== null,
            MitumError.detail(ECODE.NO_API, "no api"),
        )
        return await getAPIData(() => block.getBlockByHash(this.api, hash, this.delegateIP))
    }

    async getBlockByHeight(height: number | string) {
        Assert.check(
            this.api !== undefined || this.api !== null,
            MitumError.detail(ECODE.NO_API, "no api"),
        )
        return await getAPIData(() => block.getBlockByHeight(this.api, height, this.delegateIP))
    }

    // async getOperationsByHash(hash: string) {
    //     Assert.check(
    //         this.api !== undefined || this.api !== null,
    //         MitumError.detail(ECODE.NO_API, "no api"),
    //     )
    //     return await getAPIData(() => operation.getBlockOperationsByHash(this.api, hash, this.delegateIP))
    // }

    async getOperationsByHeight(height: number | string,limit?: number, offset?: number, reverse?: true) {
        Assert.check(
            this.api !== undefined || this.api !== null,
            MitumError.detail(ECODE.NO_API, "no api"),
        )
        return await getAPIData(() => operation.getBlockOperationsByHeight(this.api, height, this.delegateIP, limit, offset, reverse))
    }
}