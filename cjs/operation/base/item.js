"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const common_1 = require("../../common");
class Item {
    constructor(hint) {
        this.hint = new common_1.Hint(hint);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString()
        };
    }
}
exports.Item = Item;
//# sourceMappingURL=item.js.map