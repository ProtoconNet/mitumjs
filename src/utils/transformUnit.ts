import { Assert, MitumError, ECODE } from "../error";

export class Utils {
    /**
     * The decimal number used in the base currency. (default value is 9.)
     * 
     * Can be modified to user-specified value using the **setDecimal()** method.
     */
    public decimal: number;

    constructor(decimal: number = 9) {
        this.decimal = decimal;
    }

    /**
     * Sets the decimal value used for unit conversions.
     * @param {number} decimal - The decimal places to be used, input integer must equal or greater than 0.
     */
    public setDecimal(decimal: number): void {
        Assert.check(
            Number.isInteger(decimal) && decimal >= 0,
            MitumError.detail(ECODE.INVALID_DECIMAL, "Invalid decimal number")
        )
        this.decimal = decimal;
    }

    /**
     * Validates if a string can be converted to a BigInt.
     * @param {string} value - The value to be validated.
     * @returns {boolean} - True if valid, false otherwise.
     */
    private isValidBigIntString(value: string): boolean {
        try {
            BigInt(value);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validates if a string is a valid decimal number.
     * @param {string} value - The value to be validated.
     * @returns {boolean} - True if valid, false otherwise.
     */
    private isValidDecimalString(value: string): boolean {
        const decimalPattern = /^-?\d+(\.\d+)?$/;
        return decimalPattern.test(value);
    }

    /**
     * Converts integer string *value* into a "decimal string", assuming decimal places.
     * The `decimal` number can be set with `setDecimal()` and the default value is 9.
     * @param {string} value - Integer in string type.
     * @returns {string} - Value expressed in minimum units.
     * @example
     * // Example: Convert PAGE to FACT (decimal: 9)
     * const value = "20000000000"; //PAGE
     * const result = mitum.utils.formatUnits(value);
     * console.log(`PAGE to FACT: ${result}`); // "20.0"
     */
    public formatUnits(value: string): string {
        Assert.check(
            this.isValidBigIntString(value),
            MitumError.detail(ECODE.INVALID_BIG_INTEGER, "Invalid BigNumberish string: Cannot convert to a BigInt")
        )
        const bigIntVal = BigInt(value);
        const factor = BigInt(10 ** this.decimal);
        const integerPart = bigIntVal / factor;
        const integerString = integerPart === 0n && bigIntVal < 0n ? `-${integerPart.toString()}` : integerPart.toString();
        const fractionalPart = bigIntVal % factor < 0n ? -bigIntVal % factor : bigIntVal % factor;
        const fractionalString = fractionalPart.toString().padStart(this.decimal, '0');
        if ( fractionalString === undefined || /^0*$/.test(fractionalString)) {
            return `${integerString}.0`
        } else {
            return `${integerString}.${fractionalString.replace(/0+$/, '')}`
        }
    }

    /**
     * Converts the "decimal string" *value* to a integer string, assuming decimal places. 
     * The `decimal` number can be set with `setDecimal()` and the default value is 9.
     * @param {string} value - Decimal number in string type.
     * @returns {string} - Value expressed in basis units.
     * @example
     * // Example: Convert FACT to PAGE (decimal: 9)
     * const value = "12.12345"; //FACT
     * const result = mitum.utils.parseUnits(value);
     * console.log(`FACT to PAGE: ${result}`); // "12123450000"
     */
    public parseUnits(value: string): string {
        Assert.check(
            this.isValidDecimalString(value),
            MitumError.detail(ECODE.INVALID_FLOAT, "Invalid decimal string")
        )
        if (Number(value) === 0) {
            return "0"
        }
        let [integerPart, fractionalPart = ''] = value.split('.');
        fractionalPart = Number(fractionalPart) === 0 ? '' : fractionalPart;
        integerPart = Number(integerPart) === 0 ? '' : integerPart;
    
        Assert.check(
            fractionalPart.length <= this.decimal,
            MitumError.detail(ECODE.INVALID_FLOAT, "Fractional part exceeds the decimal limit")
        )
    
        const paddedFractional = fractionalPart.padEnd(this.decimal, '0');
        return integerPart + paddedFractional;
    }
}
