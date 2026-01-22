import { Version } from "../node"
import { IString } from "../types"

export class Hint implements IString {
    private s: string;

    constructor(s: string) {
        this.s = Hint.hasVersion(s) ? s : `${s}-${Version.get()}`;
    }

    toString(): string {
        return this.s;
    }

    static hasVersion(s: string): boolean {
        const suffix = `-${Version.get()}`;
        return s.endsWith(suffix);
    }

    static fromString(s: string): Hint {
        if (!Hint.hasVersion(s)) {
            throw new Error(`Invalid hinted string (missing version): ${s}`);
        }

        const h = Object.create(Hint.prototype) as Hint;
        h.s = s;
        return h;
    }
}