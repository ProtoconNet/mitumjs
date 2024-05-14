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
    EMPTY_SIGN: "EC_EMPTY_SIGN",
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
    INVALID_ADDRESS_CHECKSUM: "EC_INVALID_ADDRESS_CHECKSUM",
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
    TIME_OUT: "EC_TIME_OUT",
    TRANSACTION_REVERTED: "EC_TRANSACTION_REVERTED"
} as const


// ECODE: Mitum Node Process Error code
export const PCODE = {
    AMBIGUOUS: {
        code: "P0A",
        keyword: [""],
        description: "AMBIGUOUS",
        subject: "",
    },
    MITUM_CORE: {
        code: "P0M",
        keyword: [""],
        description: "MITUM CORE",
        subject: "",
    },
    UNDEFINED: {
        code: "P00",
        keyword: [""],
        description: "UNDEFINED",
        subject: "",
    },
    IV_BASE_OP:{
        code: "P01",
        keyword: ["Invalid BaseOperation"],
        description: "Error from IsValid(BaseOperation)",
        subject: "",
    },
    IV_BASE_NODE_OP: {
        code: "P02",
        keyword: ["Invalid BaseNodeOperation"],
        description: "Error from IsValid(BaseNodeOperation)",
        subject: "",
    },
    IV_BASE_STATE: {
        code: "P03",
        keyword: ["Invalid BaseState"],
        description: "Error from IsValid(BaseState)",
        subject: "",
    },
    IV_FACT: {
        code: "P04",
        keyword: ["Invalid fact"],
        description: "Error from IsValid(Fact)",
        subject: "",
    },
    IV_ITEM: {
        code: "P05",
        keyword: ["Invalid item"],
        description: "Error from IsValid(Item)",
        subject: "",
    },
    PREPROCESS: {
        code: "P06",
        keyword: ["PreProcess"],
        description: "Error from PreProcess",
        subject: "",
    },
    DECODE_JSON: {
        code: "P07",
        keyword: ["Decode Json"],
        description: "Error from DecodeJSON",
        subject: "",
    },
    DECODE_BSON: {
        code: "P08",
        keyword: ["Decode Bson"],
        description: "Error from DecodeBSON",
        subject: "",
    },
} as const


export const DCODE = {
    AMBIGUOUS: {
        code: "D00A",
        keyword: [""],
        description: "AMBIGUOUS",
        subject: "",
    },
    COMPLEX: {
        code: "D00C",
        keyword: [""],
        description: "COMPLEX",
        subject: "",
    },
    OP_DEP: {
        code: "D00D",
        keyword: [""],
        description: "Operation dependent",
        subject: "",
    },
    UNDEFINED: {
        code: "D000",
        keyword: [""],
        description: "UNDEFINED",
        subject: ""
    },
    // data validation
    EMPTY: {
        code: "D101",
        keyword: ["Operation has empty token"],
        description: "EMPTY or NULL data",
        subject: ""
    },
    IV_LENGTH: {
        code: "D102",
        keyword: ["Array length"],
        description: "length of array",
        subject: ""
    },
    IV_RANGE: {
        code: "D103",
        keyword: ["Value out of range", "Operation token size too large"],
        description: "Out of range",
        subject: ""
    },
    IV_TYPE: {
        code: "D104",
        keyword: ["Type mismatch", "Invalid account type", "Invalid value"],
        description: "Invalid type",
        subject: ""
    },
    DUPLICATED_VAL: {
        code: "D105",
        keyword: ["Duplicated value"],
        description: "Duplicated value",
        subject: ""
    },
    D106: {
        code: "D106",
        keyword: [""],
        description: "",
        subject: ""
    },
    IV_CHAR: {
        code: "D107",
        keyword: [""],
        description: "Special characters",
        subject: ""
    },
    DECODE_FACT: {
        code: "D108",
        keyword: [""],
        description: "",
        subject: ""
    },
    DECODE_ITEM: {
        code: "D109",
        keyword: [""],
        description: "",
        subject: ""
    },
    DECODE_OP: {
        code: "D110",
        keyword: [""],
        description: "",
        subject: ""
    },
    UNMARSHAL_ITEM: {
        code: "D111",
        keyword: [""],
        description: "",
        subject: ""
    },
    UNMARSHAL_FACT: {
        code: "D112",
        keyword: [""],
        description: "",
        subject: ""
    },
    SELF_TARGETED: {
        code: "D113",
        keyword: ["Self targeted"],
        description: "",
        subject: ""
    },
    D114: {
        code: "D114",
        keyword: [""],
        description: "",
        subject: ""
    },
    D115: {
        code: "D115",
        keyword: [""],
        description: "",
        subject: ""
    },
    D116: {
        code: "D116",
        keyword: [""],
        description: "",
        subject: ""
    },
    D117: {
        code: "D117",
        keyword: [""],
        description: "",
        subject: ""
    },
    // signature related
    IV_SIGN: {
        code: "D201",
        keyword: ["Invalid signing"],
        description: "",
        subject: ""
    },
    D202: {
        code: "D202",
        keyword: [""],
        description: "",
        subject: ""
    },
    LACK_OF_SIGN: {
        code: "D203",
        keyword: ["Not enough signs"],
        description: "",
        subject: ""
    },
    D204: {
        code: "D204",
        keyword: [""],
        description: "",
        subject: ""
    },
    // authorization related
    UNAUTHORIZED_AC: {
        code: "D301",
        keyword: ["Account not authorized"],
        description: "sender is not owner neither operator of the contract",
        subject: ""
    },
    NOT_IN_WHITELIST: {
        code: "D302",
        keyword: [""],
        description: "account not in the whitelist",
        subject: ""
    },
    // insufficient balance
    D401: {
        code: "D401",
        keyword: [""],
        description: "",
        subject: ""
    },
    // state related
    STATE_NOT_FOUND: {
        code: "D501",
        keyword: ["Account not found", "Currency not found", "Contract account not found", "Service not found"],
        description: "",
        subject: ""
    },
    D502: {
        code: "D502",
        keyword: [""],
        description: "",
        subject: ""
    },
    STATE_EXIST: {
        code: "D503",
        keyword: ["Account exist", "Contract account exist", "Currency exist", "State exist"],
        description: "",
        subject: ""
    },
    D504: {
        code: "D504",
        keyword: [""],
        description: "",
        subject: ""
    },
    IV_STATE_VAL: {
        code: "D505",
        keyword: ["Invalid state value"],
        description: "",
        subject: ""
    },
    CONTRACT_ACCOUNT: {
        code: "D506",
        keyword: ["Contract account not allowed"],  
        description: "",
        subject: ""
    },
    D507: {
        code: "D507",
        keyword: [""],
        description: "",
        subject: ""
    },
    D508: {
        code: "D508",
        keyword: [""],
        description: "",
        subject: ""
    },
} as const

export const assignCodeFromErrorMessage = (errorMessage: string): error_code => {
    const pcodeArr : string[] = [];
    const dcodeArr : string[] = [];

    for (const [_, obj] of Object.entries(PCODE)) {
        if (obj.keyword[0] !== "" && errorMessage.includes(obj.keyword[0])) {
            pcodeArr.push(obj.code);
        }
    }

    for (const [_, obj] of Object.entries(DCODE)) {
        if (obj.keyword[0] !== "") {
            for (const keyword of obj.keyword) {
                if (errorMessage.includes(keyword)) {
                    dcodeArr.push(obj.code);
                }
            }
        }
    }

    return {pcode: pcodeArr, dcode: dcodeArr}
}

Object.keys(PCODE)