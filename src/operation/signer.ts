import base58 from "bs58"
import { Authentication, ProxyPayer, Settlement, GeneralFactSign, NodeFactSign } from "./base"
import type { BaseOperation, Fact, UserOperationJson, OperationJson, SignOption } from "./base"
import { sha3 } from "../utils"
import { Key } from "../key/pub"
import { KeyPair } from "../key/keypair"
import { NodeAddress } from "../key/address"
import { Generator, HintedObject, FullTimeStamp, TimeStamp, IP } from "../types"
import { StringAssert, Assert, ECODE, MitumError } from "../error"
import { isOpFact, isHintedObject, isHintedObjectFromUserOp} from "../utils/typeGuard"

export class Signer extends Generator {

    constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }
    
    /**
     * Sign the given operation in JSON format using given private key.
	 * @param {string | Key} [privatekey] - The private key used for signing.
	 * @param {Operation<Fact> | HintedObject} [operation] - The operation to be signed.
	 * @param {SignOption} [option] - (Optional) Option for node sign.
	 * @returns The signed operation in JSON object (HintedObject).
     */
    sign(
        privatekey: string | Key,
        operation: BaseOperation<Fact> | HintedObject,
        option?: SignOption
    ) {
        Assert.check(
			isOpFact(operation) || isHintedObject(operation), 
			MitumError.detail(ECODE.INVALID_OPERATION, `input is neither in OP<Fact> nor HintedObject format`)
		)
		operation = isOpFact(operation) ? operation.toHintedObject() : operation;
        Key.from(privatekey);
        const keypair = KeyPair.fromPrivateKey(privatekey)
        return option ? this.nodeSign(keypair as KeyPair, operation as OperationJson, option.node ?? "") : this.accSign(keypair as KeyPair, operation as OperationJson)
    }

    private accSign(keypair: KeyPair, operation: OperationJson) {
        const now = TimeStamp.new()

        const fs = new GeneralFactSign(
            keypair.publicKey.toString(),
            keypair.sign(
                Buffer.concat([
                    Buffer.from(this.networkID),
                    base58.decode(operation.fact.hash),
                    now.toBuffer(),
                ])
            ),
            now.toString(),
        ).toHintedObject()

        if (operation.signs !== undefined) {
            operation.signs = [...operation.signs, fs]
        } else {
            operation.signs = [fs]
        }

        Assert.check(
            new Set(operation.signs.map(fs => fs.signer.toString())).size === operation.signs.length,
            MitumError.detail(ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"),
        )

        const factSigns = operation.signs
            .map((s) =>
                Buffer.concat([
                    Buffer.from(s.signer),
                    base58.decode(s.signature),
                    new FullTimeStamp(s.signed_at).toBuffer("super"),
                ])
            )
            //.sort((a, b) => Buffer.compare(a, b))

        const msg = Buffer.concat([
            base58.decode(operation.fact.hash),
            Buffer.concat(factSigns),
        ])

        if (isHintedObjectFromUserOp(operation as UserOperationJson)) {
            return this.FillUserOpHash(operation as UserOperationJson);
        } 

        operation.hash = base58.encode(sha3(msg))

        return operation
    }


    private nodeSign(keypair: KeyPair, operation: OperationJson, node: string) {
        const nd = new NodeAddress(node)
        const now = TimeStamp.new()
        const fs = new NodeFactSign(
            node,
            keypair.publicKey.toString(),
            keypair.sign(
                Buffer.concat([
                    Buffer.from(this.networkID),
                    nd.toBuffer(),
                    base58.decode(operation.fact.hash),
                    now.toBuffer(),
                ])
            ),
            now.toString(),
        ).toHintedObject()

        if (operation.signs) {
            operation.signs = [...operation.signs, fs]
        } else {
            operation.signs = [fs]
        }

        const factSigns = operation.signs
            .map((s) =>
                Buffer.concat([
                    Buffer.from(s.signer),
                    base58.decode(s.signature),
                    new FullTimeStamp(s.signed_at).toBuffer("super"),
                ])
            )
            .sort((a, b) => Buffer.compare(a, b))

        const msg = Buffer.concat([
            base58.decode(operation.fact.hash),
            Buffer.concat(factSigns),
        ])

        operation.hash = base58.encode(sha3(msg))

        return operation
    }

    private FillUserOpHash(userOperation: UserOperationJson) {
        const { extension } = userOperation;
        const { authentication, settlement, proxy_payer } = extension;
    
        this.validateUserOpFields({ ...authentication, ...settlement, ...proxy_payer });
    
        const hintedExtension = (() => {
            const auth = new Authentication(
                authentication.contract,
                authentication.authentication_id,
                authentication.proof_data
            ).toHintedObject();
            const settlementObj = new Settlement(settlement.op_sender).toHintedObject();
    
            if (proxy_payer) {
                const proxyPayerObj = new ProxyPayer(proxy_payer.proxy_payer).toHintedObject();
                return { authentication: auth, proxy_payer: proxyPayerObj, settlement: settlementObj };
            }
    
            return { authentication: auth, settlement: settlementObj };
        })();
    
        const msg = Buffer.concat([
            Buffer.from(JSON.stringify(hintedExtension)),
            base58.decode(userOperation.fact.hash),
            Buffer.concat(userOperation.signs.map((s) => Buffer.concat([
                Buffer.from(s.signer),
                base58.decode(s.signature),
                new FullTimeStamp(s.signed_at).toBuffer("super"),
            ]))),
        ]);
    
        userOperation.hash = base58.encode(sha3(msg));
        return userOperation;
    }

    private validateUserOpFields(fields: Record<string, any>): void {
        Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined) {
                StringAssert.with(
                    value,
                    MitumError.detail(ECODE.INVALID_USER_OPERATION, `Cannot sign the user operation: ${key} must not be empty.`)
                ).empty().not().excute();
            }
        });
    }
}