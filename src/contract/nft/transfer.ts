import { Address } from "../../account/address.js";
import { OperationFact } from "../../types/fact.js";
import { MitumError, Assert, ECODE } from "../../utils/error.js";
import { Big } from "../../utils/math.js";
import { NFTItem } from "./item.js";
import { HINT_NFT } from "../../types/hintNft.js";
import { HintedObject } from "../../types/interface.js";

export class NFTTransferItem extends NFTItem {
  readonly receiver: Address;
  readonly tokenId: Big;

  constructor(
    contract: string,
    collection: string,
    receiver: string,
    tokenId: string | number | Buffer | BigInt | Uint8Array,
    currency: string
  ) {
    super(HINT_NFT.HINT_NFT_TRANSFER_ITEM, contract, collection, currency);

    Assert.check(
      contract.toString() !== receiver,
      MitumError.detail(
        ECODE.INVALID_PARAMETER,
        "The contract address is the same as the receiver address."
      )
    );

    this.receiver = new Address(receiver);
    this.tokenId = new Big(tokenId);
  }

  toBuffer(): Buffer {
    return Buffer.concat([
      super.toBuffer(),
      this.receiver.toBuffer(),
      this.tokenId.toBuffer("fill"),
      this.currency.toBuffer(),
    ]);
  }

  toHintedObject(): HintedObject {
    return {
      ...super.toHintedObject(),
      receiver: this.receiver.toString(),
      nft: this.tokenId.v,
    };
  }

  toString(): string {
    return this.tokenId.toString();
  }
}

export class NFTTransferFact extends OperationFact<NFTTransferItem> {
  constructor(token: string, sender: string, items: NFTTransferItem[]) {
    super(HINT_NFT.HINT_NFT_TRANSFER_OPERATION_FACT, token, sender, items);

    items.forEach((item) => {
      Assert.check(
        item instanceof NFTTransferItem,
        MitumError.detail(
          ECODE.INVALID_PARAMETER,
          "The type of items is incorrect."
        )
      );
      Assert.check(
        item.contract.toString() !== sender,
        MitumError.detail(
          ECODE.INVALID_PARAMETER,
          "The contract address is the same as the sender address."
        )
      );
    });

    const iSet = new Set(items.map((item) => item.toString()));
    Assert.check(
      iSet.size === items.length,
      MitumError.detail(
        ECODE.INVALID_PARAMETER,
        "There are duplicate elements in items."
      )
    );
  }

  get operationHint() {
    return HINT_NFT.HINT_NFT_TRANSFER_OPERATION;
  }
}
