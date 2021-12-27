import { AxiosResponse } from "axios"
import { oesApi } from "../db/OESConfig";

export const getUserPermissions = async (userGUID: string): Promise<any> => {
    try{
        const resp: AxiosResponse = await oesApi.get("User/Permissions",{
            auth: {
                username: process.env.OES_USER || "",
                password: process.env.OES_PASS || ""
            },
            params: {
                userGUID: userGUID
            }
        });

        return resp;
    } catch(err: any) {
        console.error("error while calling OES: ", err)
        throw new Error(err.response?.status);
      }
}