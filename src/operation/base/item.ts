import { Hint } from "../../common"
import type { Buffer } from "buffer";
import { HintedObject, IBuffer, IHintedObject, IString } from "../../types"

export abstract class Item implements IBuffer, IString, IHintedObject {
    private hint: Hint
    
    protected constructor(hint: string) {
        this.hint = new Hint(hint)
    }

    abstract toBuffer(): Buffer
    abstract toString(): string
    
    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString()
        }
    }
}