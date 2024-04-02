import { Operation as OP, Fact } from "../operation/base"

export const isOpFact = (operation: any): operation is OP<Fact> => {
    return operation instanceof OP;
}