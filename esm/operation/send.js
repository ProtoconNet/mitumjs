var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
export function sendOperation(signedOperation, provider, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        if (provider === "") {
            return Promise.reject(new Error("RPC-URL is not provided."));
        }
        try {
            if (headers) {
                return yield axios.post(`${provider}/builder/send`, signedOperation, {
                    headers,
                });
            }
            return yield axios.post(`${provider}/builder/send`, signedOperation);
        }
        catch (error) {
            return Promise.reject(new Error(`Error getting node information: ${error.message}`));
        }
    });
}
//# sourceMappingURL=send.js.map