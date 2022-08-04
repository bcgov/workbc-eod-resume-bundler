import * as express from "express"
import { ValidationError } from "yup"
import { UpdateJobOrder } from "../interfaces/JobOrder.interface"
import JobOrderValidationSchema from "../schemas/JobOrderValidationSchema"
import * as jobOrderService from "../services/JobOrder.service"

// Get Job Orders //
export const getJobOrders = async (req: express.Request, res: express.Response) => {
    console.log(`GET request received to ${req.get("host")}${req.originalUrl}`)
    console.log("request body: ")
    console.log(req.body)

    try {
        const jobOrders: any = await jobOrderService.getJobOrders()
        return res.status(200).json(jobOrders)
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

// Create Job Order //
export const createJobOrder = async (req: express.Request, res: express.Response) => {
    console.log(`POST request received to ${req.get("host")}${req.originalUrl}`)
    console.log("request body: ")
    console.log(req.body)

    try {
        JobOrderValidationSchema.validate(req.body, { abortEarly: false })
            .then(async () => {
                const newID: any = await jobOrderService.createJobOrder(req.body, req.files)
                return res.status(200).send({
                    createdID: newID
                })
            })
            .catch((validationErrors: ValidationError) => {
                console.error("validation unsuccessful: ", validationErrors)
                return res.status(400).send(validationErrors.errors.reduce((prev: any, curr: any) => ({ ...prev, [curr.key]: curr.value }), {}))
            })
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

// Close Job Order //
export const setToClosed = async (req: express.Request, res: express.Response) => {
    console.log(`PUT request received to ${req.get("host")}${req.originalUrl}`)
    console.log("request params: ")
    console.log(req.params)

    try {
        await jobOrderService.setToClosed(req.params.id)
        return res.status(200).send(`Successfully closed job order`)
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

// Open Job Order //
export const setToOpen = async (req: express.Request, res: express.Response) => {
    console.log(`PUT request received to ${req.get("host")}${req.originalUrl}`)
    console.log("request params: ")
    console.log(req.params)

    try {
        await jobOrderService.setToOpen(req.params.id)
        return res.status(200).send(`Successfully opened job order`)
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

// Edit Job Order //
export const editJobOrder = async (req: express.Request, res: express.Response) => {
    console.log(`PUT request received to ${req.get("host")}${req.originalUrl}`)
    console.log("request body: ")
    console.log(req.body)

    try {
        const updateBody: UpdateJobOrder = {
            employer: req.body.employer,
            position: req.body.position,
            location: req.body.location,
            startDate: req.body.startDate,
            deadline: req.body.deadline,
            catchments: req.body.catchments.map((c: any) => c.catchment_id),
            user: req.body.user
        }

        await jobOrderService.editJobOrder(req.params.jobID, updateBody)
        return res.status(200).send()
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

// Download Job Description //
export const downloadJobDescription = async (req: express.Request, res: express.Response) => {
    console.log(`GET request received to ${req.get("host")}${req.originalUrl}`)
    console.log("request body: ")
    console.log(req.body)

    try {
        const jobDescription: any = await jobOrderService.downloadJobDescription(req.params.jobID)
        return res.status(200).json(jobDescription)
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}
