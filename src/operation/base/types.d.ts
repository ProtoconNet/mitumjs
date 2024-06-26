type FS = {
    node?: string,
    signer: string,
    signed_at: string,
    signature: string,
}

export type GeneralFS = {
    signer: string,
    signed_at: string,
    signature: string,
}

export type NodeFS = {
    node: string,
    signer: string,
    signed_at: string,
    signature: string,
}

export type FactJson = {
    _hint: string,
    token: string,
    hash: string,
    [i: string]: any,
}

export type OperationJson = {
    _hint: string,
    fact: FactJson,
    hash: string,
    signs: FS[]
}

export type SignOption = {
    node?: string
}