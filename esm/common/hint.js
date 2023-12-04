import { Version } from "../node";
export class Hint {
    s;
    constructor(s) {
        this.s = s;
    }
    toString() {
        return `${this.s}-${Version.get()}`;
    }
}
//# sourceMappingURL=hint.js.map