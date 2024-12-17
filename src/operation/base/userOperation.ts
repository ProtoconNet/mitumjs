import base58 from "bs58"
import { isBase58Encoded } from "../../utils/typeGuard"
import { Fact } from "./fact"
import { GeneralFactSign, NodeFactSign } from "./factsign"
import { Operation } from "./operation"
import { Hint } from "../../common"
import { HINT } from "../../alias"
import { SortFunc } from "../../utils"
import { validateDID } from "../../utils/typeGuard"
import { Assert, ECODE, MitumError, StringAssert } from "../../error"
import { Address, Key, KeyPair } from "../../key"
import { HintedObject, HintedExtensionObject, IHintedObject, TimeStamp } from "../../types"

type FactSign = GeneralFactSign | NodeFactSign

export class Authentication implements IHintedObject {
    readonly contract: Address;
    readonly authenticationId: string;
    readonly proofData: string;
    private hint: Hint;
    
    constructor(
        contract: string | Address, 
        authenticationId: string, 
        proofData : string | undefined,
    ) {
        this.hint = new Hint(HINT.CURRENCY.EXTENSION.AUTHENTICATION);
        this.contract = Address.from(contract);
        this.authenticationId = authenticationId;
        if (proofData) {
            Assert.check(
                isBase58Encoded(proofData),
                MitumError.detail(ECODE.INVALID_USER_OPERATION, `proof_data must in base58 encoded`)
            );
        };
        this.proofData = proofData ? proofData : "";
    }

    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString(),
            contract: this.contract.toString(),
            authentication_id: this.authenticationId,
            proof_data: this.proofData,
        }
    }
}

export class ProxyPayer implements IHintedObject {
    readonly proxyPayer: Address;
    private hint: Hint;
 
    constructor(
        proxyPayer: string | Address,
    ) {
        this.hint = new Hint(HINT.CURRENCY.EXTENSION.PROXY_PAYER);
        this.proxyPayer = Address.from(proxyPayer);
    }

    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString(),
            proxy_payer: this.proxyPayer.toString(),
        }
    }
}

export class Settlement implements IHintedObject {
    readonly opSender: Address | "";
    private hint: Hint;
 
    constructor(
        opSender: string | Address | undefined,
    ) {
        this.hint = new Hint(HINT.CURRENCY.EXTENSION.SETTLEMENT);
        this.opSender = opSender ? Address.from(opSender) : "";
    }

    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString(),
            op_sender: this.opSender.toString(),
        }
    }
}


export class UserOperation<T extends Fact> extends Operation<T> {
    readonly id: string
    readonly hint: Hint
    readonly fact: T
    protected auth: Authentication
    protected proxyPayer: null | ProxyPayer
    protected settlement: Settlement
    protected _factSigns: FactSign[]
    protected _hash: Buffer
    constructor(
        networkID: string,
        fact: T, 
        auth: Authentication,
        proxyPayer: null | ProxyPayer,
        settlement: Settlement
    ) {
        super(networkID, fact);
        this.id = networkID;
        this.fact = fact;

        if ("sender" in fact) {
            this.isSenderDidOwner(fact.sender as string, auth.authenticationId, true);
        };

        this.auth = auth;
        this.proxyPayer = proxyPayer;
        this.settlement = settlement;

        this.hint = new Hint(fact.operationHint);
        this._factSigns = [];
        this._hash = Buffer.from([]);
    }

    get hash() {
        return this._hash
    }

    toBuffer(): Buffer {
        if (!this._factSigns) {
            return this.fact.hash
        }

        this._factSigns = this._factSigns.sort(SortFunc);

        return Buffer.concat([
            Buffer.from(JSON.stringify(this.toHintedExtension())),
            this.fact.hash,
            Buffer.concat(this._factSigns.map((fs) => fs.toBuffer())),
        ])
    }

    toHintedObject(): HintedObject {
        const operation = {
            _hint: this.hint.toString(),
            fact: this.fact.toHintedObject(),
            extension: this.proxyPayer ? 
            {
                authentication: this.auth.toHintedObject(),
                proxy_payer: this.proxyPayer.toHintedObject(),
                settlement: this.settlement.toHintedObject(),
            } :
            {
                authentication: this.auth.toHintedObject(),
                settlement: this.settlement.toHintedObject(),
            },
            hash: this._hash.length === 0 ? "" : base58.encode(this._hash)
        }
        const factSigns = this._factSigns.length === 0 ? [] : this._factSigns.sort(SortFunc);

        return {
            ...operation,
            signs: factSigns.map(fs => fs.toHintedObject())
        }
    }

    private toHintedExtension(): HintedExtensionObject {
        return this.proxyPayer ? 
            {
                authentication: this.auth.toHintedObject(),
                proxy_payer: this.proxyPayer.toHintedObject(),
                settlement: this.settlement.toHintedObject(),
            } :
            {
                authentication: this.auth.toHintedObject(),
                settlement: this.settlement.toHintedObject(),
            }
    }

    private isSenderDidOwner(sender: string | Address, did: string, id?: true) {
        Assert.check(
            sender.toString() === validateDID(did.toString(), id).toString(),
            MitumError.detail(ECODE.DID.INVALID_DID, `The owner of did must match the sender(${sender.toString()}). check the did (${did.toString()})`)
        );
    }

	/**
	 * Add alternative signature for userOperation, fill `proof_data` item of `authentication` object.
	 * @param {string | Key | KeyPair} [privateKey] - The private key or key pair for signing.
	 * @returns void
	 */
    // addAlterSign(privateKey: string | Key, type?: "ed25519" | "ecdsa") {
    addAlterSign(privateKey: string | Key): void {
        privateKey = Key.from(privateKey);
        const keypair = KeyPair.fromPrivateKey<KeyPair>(privateKey);
        const alterSign = keypair.sign(Buffer.from(this.fact.hash));
        this.auth = new Authentication(this.auth.contract, this.auth.authenticationId, base58.encode(alterSign)); // base58 인코딩 후 저장
    }

    /**
     * Updates the settlement details of a userOperation.
     * @param {string | Address} opSender - The opseration sender's address (Bundler's address).
     * @returns void.
     **/
    setSettlement(opSender: string | Address): void {
        Address.from(opSender);
        this.settlement = new Settlement(opSender);
    }

    /**
     * Updates the proxy payer details of a userOperation.
     * @param {string | Address} proxyPayer - The proxy payer's address. (address of CA)
     * @returns void.
     **/
    setProxyPayer(proxyPayer: string | Address): void {
        Address.from(proxyPayer);
        this.proxyPayer = new ProxyPayer(proxyPayer);
    }

    /**
     * Sign the given userOperation in JSON format using given private key.
	 * @param {string | Key} [privatekey] - The private key used for signing.
	 * @returns void.
     */
    sign(privatekey: string | Key) {
        const userOperationFields = {
            contract: this.auth.contract.toString(),
            authentication_id : this.auth.authenticationId,
            proof_data: this.auth.proofData,
            op_sender: this.settlement.opSender.toString(),
        };
        
        Object.entries(userOperationFields).forEach(([key, value]) => {
            StringAssert.with(value, MitumError.detail(ECODE.INVALID_USER_OPERATION,
                `Cannot sign the user operation: ${key} must not be empty.`)).empty().not().excute();
        });

        const keypair = KeyPair.fromPrivateKey(privatekey);
        const now = TimeStamp.new();

        const factSign = new GeneralFactSign(
            keypair.publicKey,
            keypair.sign(Buffer.concat([Buffer.from(this.id), this.fact.hash, now.toBuffer()])),
            now.toString(),
        );

        const idx = this._factSigns
            .map((fs) => fs.signer.toString())
            .indexOf(keypair.publicKey.toString());

        if (idx < 0) {
            this._factSigns.push(factSign);
        } else {
            this._factSigns[idx] = factSign;
        }

        this._hash = this.hashing();
    }

    // export(filePath: string) {
    //     writeFile(filePath, JSON.stringify(this.toHintedObject(), null, 4), (e) => {
    //         if (e) {
    //             throw MitumError.detail(ECODE.FAIL_FILE_CREATION, "fs write-file failed")
    //         }
    //     })
    // }
}