export type KEYPAIR_TYPE_BTC = "btc";
export type KEYPAIR_TYPE_ETHER = "ether";
export type ADDRESS_TYPE_MITUM = "mitum";
export type ADDRESS_TYPE_ETHER = "ether";
export type ADDRESS_TYPE_ZERO = "zero";
export type ADDRESS_TYPE_NODE = "node";
export type AddressType = ADDRESS_TYPE_MITUM | ADDRESS_TYPE_ETHER | ADDRESS_TYPE_ZERO | ADDRESS_TYPE_NODE;
export type KeyPairType = KEYPAIR_TYPE_BTC | KEYPAIR_TYPE_ETHER;
export type Account = {
    privatekey: string;
    publickey: string;
    address: string;
};
