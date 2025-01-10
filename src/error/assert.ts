import { ErrorCode, ECODE } from "./code"
import { RangeConfig } from "../node"

export class MitumError extends Error {
    readonly code: ErrorCode
    
    private constructor(code: ErrorCode, msg?: string) {
        super(msg)
        this.code = code
    }

    static new() {
        return new MitumError(ECODE.UNKNOWN)
    }

    static detail(code?: ErrorCode, msg?: string) {
        return new MitumError(code ?? ECODE.UNKNOWN, msg)
    }
}

export class Assert {
    private condition: boolean
    private error: MitumError

    private constructor(condition: boolean, error: MitumError) {
        this.condition = condition
        this.error = error
    }

    static get(condition: boolean, error?: MitumError) {
        return new Assert(condition, error ?? MitumError.new())
    }

    static check(condition: boolean, error?: MitumError) {
        Assert.get(condition, error).excute()
    }

    not() {
        this.condition = !this.condition
        return this
    }

    true() {
        return this
    }

    false() {
        return this.not()
    }

    excute() {
        if (!this.condition) {
            throw this.error
        }
    }
}

export class StringAssert {
    private readonly s: string
    private condition: boolean | undefined
    private error: MitumError

    private constructor(s: string,  error: MitumError) {
        this.s = s
        this.error = error
        this.condition = undefined
    }

    static with(s: string, error?:MitumError) {
        return new StringAssert(s, error ?? MitumError.new())
    }

    private union(condition: boolean) {
        if (this.condition !== undefined) {
            this.condition = this.condition && condition
        } else {
            this.condition = condition
        }
    }

    not() {
        if (this.condition !== undefined) {
            this.condition = !this.condition
        }
        return this
    }

    empty() {
        this.union(this.s === "")
        return this
    }

    equal(s: string) {
        this.union(this.s === s)
        return this
    }

    startsWith(...pre: string[]) {
        this.union(pre.reduce((prev, curr) => prev || this.s.startsWith(curr), false))
        return this
    }

    endsWith(...suf: string[]) {
        this.union(suf.reduce((prev, curr) => prev || this.s.endsWith(curr), false))
        return this
    }

    satisfyConfig(config: RangeConfig) {
        this.union(config.satisfy(this.s.length))
        return this
    }

    chainAnd(...conditions: boolean[]) {
        this.union(conditions.reduce((prev, curr) => prev && curr, true))
        return this
    }

    chainOr(...conditions: boolean[]) {
        this.union(conditions.reduce((prev, curr) => prev || curr, false))
        return this
    }

    excute() {
        if (!this.condition) {
            throw this.error
        }
    }
}

export class ArrayAssert {
    private array: any[];
    private arrayName: string;
    private validType: boolean = false;

    constructor(array: any[], arrayName: string) {
        this.array = array;
        this.arrayName = arrayName;
    }

    private validateType() {
        if (this.validType) return;

        if (!Array.isArray(this.array)) {
            throw MitumError.detail(ECODE.INVALID_TYPE, `the ${this.arrayName} must be in array type`);
        }

        this.validType = true;
    }

    notEmpty() {
        this.validateType();

        if (this.array.length === 0) {
            throw MitumError.detail(ECODE.INVALID_LENGTH, `${this.arrayName} cannot be an empty array`);
        }

        return this;
    }

    exactLength(length: number) {
        this.validateType();

        if (this.array.length !== length) {
            throw MitumError.detail(ECODE.INVALID_LENGTH, `the length of ${this.arrayName} must be ${length}, but got ${this.array.length}`)
        }

        return this;
    }

    rangeLength(rangeConfig: RangeConfig) {
        this.validateType();

        Assert.check(
            rangeConfig.satisfy(this.array.length),
            MitumError.detail(
                ECODE.INVALID_LENGTH,
                `The length of ${this.arrayName} must be between ${rangeConfig.min} and ${rangeConfig.max}, but got ${this.array.length}`
            )
        );
        return this;
    }

    maxLength(max: number) {
        this.validateType();

        if (this.array.length > max) {
            throw MitumError.detail(ECODE.INVALID_LENGTH, `the length of ${this.arrayName} must not exceed ${max}`);
        }

        return this;
    }

    sameLength(array2: any[], arrayName2: string) {
        this.validateType();

        if (!Array.isArray(array2)) {
            throw MitumError.detail(ECODE.INVALID_TYPE, `the ${arrayName2} must be in array type`);
        }

        if (this.array.length !== array2.length) {
            throw MitumError.detail(ECODE.INVALID_LENGTH, `The lengths of the ${this.arrayName} and ${arrayName2} must be the same.`);
        }

        return this;
    }

    noDuplicates() {
        this.validateType();

        const uniqueItems = new Set(this.array.map((el) => {return el.toString()}));
        if (uniqueItems.size !== this.array.length) {
            throw MitumError.detail(ECODE.INVALID_LENGTH, `${this.arrayName} cannot contain duplicate elements`);
        }

        return this;
    }

    static check(array: any[], arrayName: string) {
        return new ArrayAssert(array, arrayName);
    }
}
