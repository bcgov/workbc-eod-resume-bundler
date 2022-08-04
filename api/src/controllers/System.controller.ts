import * as express from "express"
import * as systemService from "../services/System.service"

// Get Catchments //
export const getCatchments = async (req: express.Request, res: express.Response) => {
    console.log(`GET request received to ${req.get("host")}${req.originalUrl}`)
    console.log("request body: ")
    console.log(req.body)

    try {
        const catchments: any = await systemService.getCatchments()
        return res.status(200).json(catchments)
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

// Get Centres //
export const getCentres = async (req: express.Request, res: express.Response) => {
    console.log(`GET request received to ${req.get("host")}${req.originalUrl}`)
    console.log("request body: ")
    console.log(req.body)

    try {
        const centres: any = await systemService.getCentres()
        return res.status(200).json(centres)
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

// Get User Permissions //
export const getUserPermissions = async (req: express.Request, res: express.Response) => {
    console.log(`GET request received to ${req.get("host")}${req.originalUrl}`)
    console.log("request body: ")
    console.log(req.body)

    try {
        const token: string = req.headers.keycloaktoken as string
        const userGUID: string = req.headers.userguid as string
        const permissions: any = await systemService.getUserPermissions(token, userGUID)
        return res.status(200).json(permissions)
    } catch (e: any | undefined) {
        const statusCode: number = e.message
        if (statusCode === 401) {
            console.log("Authentication Error")
            return res.status(401).send()
        }

        // console.log(e);
        return res.status(500).send("Internal Server Error")
    }
}
