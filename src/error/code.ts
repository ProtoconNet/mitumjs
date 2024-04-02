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
    }
} as const


// ECODE: Mitum Node Process Error code
export const PCODE = {
    P0A: [""],    
    P0M: [""],
    P00: [""],
    // Fact isValid
    P01: ["Invalid fact"],
    // Item isValid
    P02: ["Invalid item"],
    // Preprocess
    P03: ["PreProcess"],
    // Decode JSON
    P04: ["Decode Json"],
    // Node Op isValid
    P05: ["Invalid BaseNodeOperation"],
    // Decode BSON
    P06: ["Decode Bson"],  
    // Op isValid
    P07: ["Invalid BaseOperation"],  
} as const


export const DCODE = {
    D00A: [""],
    D00C: [""],
    D00D: [""],
    D000: [""],
    // data validation
    D101: [""],
    D102: ["array length"],
    D103: ["Value out of range"],
    D104: ["Type mismatch"],
    D105: ["duplicated value in array"],
    D106: [""],  
    D107: [""],
    D108: [""],
    D109: [""],
    D110: [""],
    D111: [""],
    D112: [""],
    D113: ["self targeted"],
    D114: [""],
    D115: [""],
    D116: [""],  
    D117: [""],  
    // signature related
    D201: ["Invalid signing"],
    D202: [""],
    D203: [""],
    D204: [""],
    // authorization related
    D301: [""],
    D302: [""],
    // insufficient balance
    D401: [""],
    // state related
    D501: ["Account not found", "Currency not found"],
    D502: [""],
    D503: ["Account exists"],
    D504: [""],
    D505: [""],
    D506: ["Account not authorized"],  
    D507: [""],  
    D508: [""],  
} as const

export const assignCodeFromErrorMessage = (errorMessage: string): string[] => {
    const errorCodes : string[] = [];

    for (const [pcode, msg] of Object.entries(PCODE)) {
        if (msg[0] !== "" && errorMessage.includes(msg[0])) {
            errorCodes.push(pcode);
            break; // 매칭된 값이 하나라도 있으면 더 이상 확인하지 않고 다음 입력으로 이동합니다.
        }
    }

    for (const [dcode, msgs] of Object.entries(DCODE)) {
        if (msgs[0] !== "") {
            for (const msg of msgs) {
                if (errorMessage.includes(msg)) {
                    errorCodes.push(dcode);
                    break; // 매칭된 값이 하나라도 있으면 더 이상 확인하지 않고 다음 입력으로 이동합니다.
                }
            }
        }
    }

    return errorCodes
}