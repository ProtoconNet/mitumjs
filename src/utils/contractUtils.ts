import { Address } from "../key";
import { SuccessResponse } from "../types"

export const calculateAllowance = (response: SuccessResponse, owner: string | Address, spender: string | Address) => {
    interface AllowanceItem {
        _hint: string;
        account: string;
        approved: {
            _hint: string;
            account: string;
            amount: string;
        }[];
    }

    let amount = 0;
    if (response && response.data && response.data.approve_list) {
        const approveList: AllowanceItem[] = response.data.approve_list;
        const approval = approveList.find(item => item.account === owner);
        if (approval) {
            const allowance = approval.approved.find(item => item.account === spender);
            if (allowance) {
                amount = Number(allowance.amount);
            }
        }
    }
    return {"amount": amount};
}
