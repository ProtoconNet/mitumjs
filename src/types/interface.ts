import { HintedObject } from "./hinted"

export interface IBuffer {
	toBuffer(): Buffer
}

export interface IHintedObject {
	toHintedObject(): HintedObject
}

export interface IString {
	toString(): string
}

export interface ErrorResponse {
    // status: 400,
    // method: 'post',
    // url: 'http://121.134.233.47:24321/builder/send',
    // error_code: ['P01D010', 'P02D002']
    // request_body: '{"_hint":"mitum-currency-transfer-operation-v0.0.1","fact":{....}}'
    // error_message: 'handle new operation invalid signing :  check threshold unknown key found, 26vyVJFoLZqVPmP8UADoNCsEyJYD4498vdy7uoiHgFKRUmpu'
    status: number;
    method: string | undefined;
    url: string | undefined;
    error_code: string[];
    request_body: string | undefined;
    error_message: string;
}

export interface SuccessResponse {
    // status: 200,
    // method: 'post',
    // url: 'http://121.134.233.47:24321/builder/send',
    // request_body: '{"_hint":"mitum-currency-transfer-operation-v0.0.1","fact":{....}}'
    // data: { hash: 'BmVZH5RhaVTqe9r1Qs8fyRFSm6gGnHgChKk9AwnRinnu', fact: {...}}
    status: number;
    method: string | undefined;
    url: string | undefined;
    request_body: string | undefined;
    data: any;
}