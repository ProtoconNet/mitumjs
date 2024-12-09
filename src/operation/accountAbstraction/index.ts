import { Fact, UserOperation, Authentication, Settlement } from "../base"
import { isUserOp, isHintedObjectFromUserOp } from "../../utils/typeGuard"
import { Generator, HintedObject, IP, TimeStamp } from "../../types"
import { Key, KeyPair, Address } from "../../key"
import { Assert, ECODE, MitumError } from "../../error"
import base58 from "bs58"
import { Signer } from "../signer"

export class AccountAbstraction extends Generator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }
    
    /**
     * Creates a `UserOperation` for account abstraction.
     * @param {Fact} fact - The operation fact.
     * @param {string | Address} contract - The did contract address.
     * @param {string} authentication_id - The authentication ID for the did contract.
     * @returns {UserOperation<Fact>} - The created `UserOperation` instance.
     */
    createUserOperation(
        fact: Fact,
        contract: string | Address, 
        authentication_id: string,
    ): UserOperation<Fact>  {
        return new UserOperation(
            this.networkID,
            fact,
            new Authentication(contract, authentication_id, undefined),
            new Settlement(undefined, undefined)
        );
    }

 	/**
	 * Add alternative signature for userOperation, fill `proof_data` item of `authentication` object.
	 * @param {string | Key | KeyPair} [privateKey] - The private key or key pair for signing.
	 * @param {UserOperation<Fact> | HintedObject} [userOperation] - The operation to be signed.
	 * @returns The user operation fill with authentication.
	 */
    // addAlterSign(privateKey: string | Key, type?: "ed25519" | "ecdsa") {
    addAlterSign(
        privateKey: string | Key,
        userOperation: UserOperation<Fact> | HintedObject
    ) {
        Assert.check(
			isUserOp(userOperation) || isHintedObjectFromUserOp(userOperation), 
			MitumError.detail(ECODE.INVALID_USER_OPERATION, `Input must in UserOperation format`)
		)
		const hintedUserOp = isUserOp(userOperation) ? userOperation.toHintedObject() : userOperation;
        privateKey = Key.from(privateKey);
        const keypair = KeyPair.fromPrivateKey<KeyPair>(privateKey);
        const now = TimeStamp.new();
        const alterSign = keypair.sign(Buffer.concat([Buffer.from(this._networkID), Buffer.from(hintedUserOp.fact.hash), now.toBuffer()]));
        hintedUserOp.authentication.proof_data = base58.encode(alterSign);
        return hintedUserOp
    }

    /**
     * Updates the settlement details of a userOperation and returns a new hinted object of user operation.
     * @param {UserOperation<Fact> | HintedObject} userOperation - The user operation to update settlment,
     * @param {string | Address} opSender - The opseration sender's address (Bundler's address).
     * @param {string | Address} proxyPayer - The proxy payer's address. (address of CA)
     * @returns {HintedObject} A new hinted object representing the updated user operation.
     **/
    setSettlement(
        userOperation: UserOperation<Fact> | HintedObject,
        opSender: string | Address,
        proxyPayer: string | Address | undefined,
    ): HintedObject {
        Assert.check(
			isUserOp(userOperation) || isHintedObjectFromUserOp(userOperation), 
			MitumError.detail(ECODE.INVALID_USER_OPERATION, `Input must in UserOperation format`)
		);
        const hintedUserOp = isUserOp(userOperation) ? userOperation.toHintedObject() : userOperation;
        const { contract, authentication_id, proof_data } = hintedUserOp.authentication;
        const filledUO =  new UserOperation(
            this.networkID,
            hintedUserOp.fact,
            new Authentication(contract, authentication_id, proof_data),
            new Settlement(opSender, proxyPayer)
        );
        return {
            ...filledUO.toHintedObjectWithOutFact(hintedUserOp._hint, hintedUserOp.fact)
        }
    }

    /**
     * Sign the given userOperation in JSON format using given private key.
	 * @param {string | Key} [privatekey] - The private key used for signing.
	 * @param {UserOperation<Fact> | HintedObject} [userOperation] - The operation to be signed.
	 * @returns The signed user operation in JSON object (HintedObject).
     */
    sign(
        privatekey: string | Key,
        userOperation: UserOperation<Fact> | HintedObject,
    ) {
        Assert.check(
			isUserOp(userOperation) || isHintedObjectFromUserOp(userOperation), 
			MitumError.detail(ECODE.INVALID_USER_OPERATION, `Input must in UserOperation format`)
		)

		const hintedUserOp = isUserOp(userOperation) ? userOperation.toHintedObject() : userOperation;
        const signer = new Signer(this.networkID);
        
        return signer.sign(privatekey, hintedUserOp);
    }
}