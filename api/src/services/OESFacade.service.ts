import { AxiosError, AxiosResponse } from "axios"
import { oesApi } from "../db/OESConfig";
import { OESProfile } from "../interfaces/System.interface";

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

export const getUserProfile = async (token: string): Promise<any> => {
    try {
        const resp: AxiosResponse = await oesApi.get("Profile",{
            auth: {
              username: process.env.OES_USER || "",
              password: process.env.OES_PASS || ""
            },
            headers: {
              "KeycloakToken": token
            }
          })
          .catch(function (err: AxiosError){
            console.log("error");
            throw new Error(err.code);
        });

        return resp; 

    } catch (err: any){
        throw new Error(err.response?.status)
    }
}