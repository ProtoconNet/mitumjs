import { Address } from "../key";
import { SuccessResponse } from "../types"
import { ECODE, MitumError } from "../error"

export const calculateAllowance = (response: SuccessResponse, owner: string | Address, approved: string | Address) => {
    interface AllowanceItem {
        _hint: string;
        account: string;
        approved: {
            _hint: string;
            account: string;
            amount: string;
        }[];
    }

    let amount: string = '0';
    
    if (response.data.policy && response.data.policy.approve_list) {
        const approveList: AllowanceItem[] = response.data.policy.approve_list;
        const approval = approveList.find(item => item.account === owner);
        if (approval) {
            const allowance = approval.approved.find(item => item.account === approved);
            if (allowance) {
                amount = allowance.amount;
            }
        }
        return {'amount': amount};
    } else {
        throw MitumError.detail(ECODE.UNKNOWN, `Unknown error orccur: token policy or policy.approve_list does not exist`);
    }
    
}

export const convertToArray = (contracts: string | Address | string[] | Address[], length: number): string[] | Address[] => {
    if (typeof contracts === "string") {
        return Array(length).fill(contracts);
    } else if (Array.isArray(contracts)) {
        if (contracts.length !== length) {
            throw MitumError.detail(ECODE.INVALID_LENGTH, `length of contracts must be the same as length of the other array.`);
        }
        return contracts;
    } else {
        throw MitumError.detail(ECODE.INVALID_TYPE, `contracts must be a string or an array.`);
    }
}