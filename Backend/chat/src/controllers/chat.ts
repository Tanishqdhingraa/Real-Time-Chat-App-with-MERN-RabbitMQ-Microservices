import TryCatch from "../config/TryCatch.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";

export const createnewChat = TryCatch(
    async (req: AuthenticatedRequest  ,res)=>{
        
})