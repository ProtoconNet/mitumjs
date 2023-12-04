import { Hint } from "../../common";
export class Item {
    hint;
    constructor(hint) {
        this.hint = new Hint(hint);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString()
        };
    }
}
//# sourceMappingURL=item.js.map