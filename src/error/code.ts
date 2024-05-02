import { error_code } from '../types'

// ECODE: MitumJS Inner Proccess Error code
export type ErrorCode = (
    typeof ECODE[keyof typeof ECODE]
    | typeof ECODE.CURRENCY[keyof typeof ECODE.CURRENCY]
    | typeof ECODE.NFT[keyof typeof ECODE.NFT]
    | typeof ECODE.STO[keyof typeof ECODE.STO]
    | typeof ECODE.DAO[keyof typeof ECODE.DAO]
)

export const ECODE = {
    NO_API: "EC_NO_API",    
    UNKNOWN: "EC_UNKNOWN",
    EMPTY_STRING: "EC_EMPTY_STRING",
    INVALID_DATE: "EC_INVALID_DATE",
    INVALID_IP: "EC_INVALID_IP",
    INVALID_LENGTH: "EC_INVALID_LENGTH",
    INVALID_SEED: "EC_INVALID_SEED",
    INVALID_KEY: "EC_INVALID_KEY",
    INVALID_KEYS: "EC_INVALID_KEYS",
    INVALID_KEY_PAIR: "EC_INVALID_KEY_PAIR",
    INVALID_PRIVATE_KEY: "EC_INVALID_PRIVATE_KEY",
    INVALID_PUBLIC_KEY: "EC_INVALID_PUBLIC_KEY",
    INVALID_WEIGHT: "EC_INVALID_WEIGHT",
    INVALID_THRESHOLD: "EC_INVALID_THRESHOLD",
    INVALID_ADDRESS: "EC_INVALID_ADDRESS",
    INVALID_ADDRESS_TYPE: "EC_INVALID_ADDRESS_TYPE",
    INVALID_BIG_INTEGER: "EC_INVALID_BIG_INTERGER",
    INVALID_FLOAT: "EC_INVALID_FLOAT",
    INVALID_UINT8: "EC_INVALID_UINT8",
    INVALID_HINT: "EC_INVALID_HINT",
    INVALID_TOKEN: "EC_INVALID_TOKEN",
    INVALID_CURRENCY_ID: "EC_INVALID_CURRENCY_ID",
    INVALID_CONTRACT_ID: "EC_INVALID_CONTRACT_ID",
    INVALID_NETWORK_ID: "EC_INVALID_NETWORK_ID",
    INVALID_VERSION: "EC_INVALID_VERSION",
    INVALID_ITEM: "EC_INVALID_ITEM",
    INVALID_ITEMS: "EC_INVALID_ITEMS",
    INVALID_FACTSIGN: "EC_INVALID_FACTSIGN",
    INVALID_FACTSIGNS: "EC_INVALID_FACTSIGNS",
    INVALID_SIG_TYPE: "EC_INVALID_SIG_TYPE",
    INVALID_FACT: "EC_INVALID_FACT",
    INVALID_OPERATION: "EC_INVALID_OPERATION",
    INVALID_OPERATIONS: "EC_INVALID_OPERATIONS",
    INVALID_SEAL: "EC_INVALID_SEAL",
    INVALID_AMOUNT: "EC_INVALID_AMOUNT",
    INVALID_AMOUNTS: "EC_INVALID_AMOUNTS",
    INVALID_RATIO: "EC_INVALID_RATIO",
    INVALID_DATA_STRUCTURE: "EC_INVALID_DATA_STRUCTURE",
    INVALID_CHARACTER: "EC_NVALID_CHARACTER",
    NOT_IMPLEMENTED_BUFFER: "EC_NOT_IMPLEMENTED_BUFFER",
    NOT_IMPLEMENTED_HINTED_OBJECT: "EC_NOT_IMPLEMENTED_HINTED_OBJECT",
    NOT_IMPLEMENTED_METHOD: "EC_NOT_IMPLEMENTED_METHOD",
    FAIL_FILE_CREATION: "EC_FAIL_FILE_CREATION",
    FAIL_SIGN: "EC_FAIL_SIGN",
    CURRENCY: {
        INVALID_CURRENCY_FEEER: "EC_INVALID_CURRENCY_FEEER",
        INVALID_CURRENCY_POLICY: "EC_INVALID_CURRENCY_POLICY",
        INVALID_CURRENCY_DESIGN: "EC_INVALID_CURRENCY_DESIGN",
    },
    NFT: {
        INVALID_NFT_SIGNER: "EC_INVALID_NFT_SIGNER",
        INVALID_NFT_SIGNERS: "EC_INVALID_NFT_SIGNERS",
    },
    STO: {
        INVALID_PARTITION: "EC_INVALID_PARTITION",
    },
    DAO: {
        INVALID_WHITELIST: "EC_INVALID_WHITELIST",
        UNMATCHED_SENDER: "EC_UNMATCHED_SENDER"
    },
    TIME_OUT: "EC_TIME_OUT"
} as const


// ECODE: Mitum Node Process Error code
export const PCODE = {
    P0A: {
        keyword: [""],
        description: "AMBIGUOUS",
        subject: "",
    },    
    P0M: {
        keyword: [""],
        description: "MITUM CORE",
        subject: "",
    },
    P00: {
        keyword: [""],
        description: "UNDEFINED",
        subject: "",
    },
    P01: {
        keyword: ["Invalid BaseOperation"],
        description: "Error from IsValid(BaseOperation)",
        subject: "",
    },
    P02: {
        keyword: ["Invalid BaseNodeOperation"],
        description: "Error from IsValid(BaseNodeOperation)",
        subject: "",
    },
    P03: {
        keyword: ["Invalid fact"],
        description: "Error from IsValid(Fact)",
        subject: "",
    },
    P04: {
        keyword: ["Invalid item"],
        description: "Error from IsValid(Item)",
        subject: "",
    },
    P05: {
        keyword: ["PreProcess"],
        description: "Error from PreProcess",
        subject: "",
    },
    P06: {
        keyword: ["Decode Json"],
        description: "Error from DecodeJSON",
        subject: "",
    },
    P07: {
        keyword: ["Decode Bson"],
        description: "Error from DecodeBSON",
        subject: "",
    },
} as const


export const DCODE = {
    D00A: {
        keyword: [""],
        description: "",
        subject: "",
    },
    D00C: {
        keyword: [""],
        description: "",
        subject: "",
    },
    D00D: {
        keyword: [""],
        description: "",
        subject: "",
    },
    D000: {
        keyword: [""],
        description: "",
        subject: ""
    },
    // data validation
    D101: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D102: {
        keyword: ["Array length"],
        description: "",
        subject: ""
    },
    D103: {
        keyword: ["Value out of range", "Operation token size too large"],
        description: "",
        subject: ""
    },
    D104: {
        keyword: ["Type mismatch"],
        description: "",
        subject: ""
    },
    D105: {
        keyword: ["Duplicated value"],
        description: "",
        subject: ""
    },
    D106: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D107: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D108: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D109: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D110: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D111: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D112: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D113: {
        keyword: ["Self targeted"],
        description: "",
        subject: ""
    },
    D114: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D115: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D116: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D117: {
        keyword: [""],
        description: "",
        subject: ""
    },
    // signature related
    D201: {
        keyword: ["Invalid signing"],
        description: "",
        subject: ""
    },
    D202: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D203: {
        keyword: ["Not enough signs"],
        description: "",
        subject: ""
    },
    D204: {
        keyword: [""],
        description: "",
        subject: ""
    },
    // authorization related
    D301: {
        keyword: ["Account not authorized"],
        description: "",
        subject: ""
    },
    D302: {
        keyword: [""],
        description: "",
        subject: ""
    },
    // insufficient balance
    D401: {
        keyword: [""],
        description: "",
        subject: ""
    },
    // state related
    D501: {
        keyword: ["Account not found", "Currency not found"],
        description: "",
        subject: ""
    },
    D502: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D503: {
        keyword: ["Account exists", "Currency already registered"],
        description: "",
        subject: ""
    },
    D504: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D505: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D506: {
        // 수정될 예정
        keyword: ["Contract account disallowed"],  
        description: "",
        subject: ""
    },
    D507: {
        keyword: [""],
        description: "",
        subject: ""
    },
    D508: {
        keyword: [""],
        description: "",
        subject: ""
    },
} as const

export const assignCodeFromErrorMessage = (errorMessage: string): error_code => {
    const pcodeArr : string[] = [];
    const dcodeArr : string[] = [];

    for (const [pcode, obj] of Object.entries(PCODE)) {
        if (obj.keyword[0] !== "" && errorMessage.includes(obj.keyword[0])) {
            pcodeArr.push(pcode);
        }
    }

    for (const [dcode, obj] of Object.entries(DCODE)) {
        if (obj.keyword[0] !== "") {
            for (const keyword of obj.keyword) {
                if (errorMessage.includes(keyword)) {
                    dcodeArr.push(dcode);
                }
            }
        }
    }

    return {pcode: pcodeArr, dcode: dcodeArr}
}