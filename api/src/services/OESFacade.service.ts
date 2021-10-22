import { AxiosResponse } from "axios";
import { oesApi } from "../db/OESConfig";

export const getUserPermissions = async (token: string, params: any): Promise<any> => {
    try{
        const resp: AxiosResponse = await oesApi.get("User/Permissions",{
            auth: {
                username: process.env.OES_USER || "",
                password: process.env.OES_PASS || ""
            },
            headers: {
                "KeycloakToken": token
            },
            params: {
                userGUID: params.userGUID,
                username: params.username,
                isIDIR: params.isIDIR
            }
        });

        return resp;
    } catch(err: any) {
        console.error("error while calling OES: ", err)
        throw new Error(err.response?.status);
      }
}