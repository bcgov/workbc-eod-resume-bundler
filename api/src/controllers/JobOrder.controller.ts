import * as express from "express";
import { ValidationError } from "yup";
import * as jobOrderService from "../services/JobOrder.service";
import { JobOrderValidationSchema } from "../schemas/JobOrderValidationSchema";

// Get Job Orders //
export const getJobOrders = async (req: express.Request, res: express.Response) => {
  console.log("GET request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);

  try {
    let jobOrders: any = await jobOrderService.getJobOrders();
    return res.status(200).json(jobOrders);

  } catch(e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
};

// Create Job Order //
export const createJobOrder = async (req: express.Request, res: express.Response) => {
  console.log("POST request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);

  try {
    JobOrderValidationSchema.validate(req.body, { abortEarly: false })
    .then(async () => {
      let newID: any = await jobOrderService.createJobOrder(req.body);
      return res.status(200).send(
      {
        createdID: newID
      });
    })
    .catch((validationErrors: ValidationError) => {
      console.error("validation unsuccessful: ", validationErrors);
      return res.status(400).send(validationErrors.errors.reduce((prev: any, curr: any) => ({ ...prev, [curr.key]: curr.value}), {}));
    });
    
  } catch(e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
};

// Close Job Order //
export const setToClosed = async (req: express.Request, res: express.Response) => {
  console.log("POST request received to " + req.get("host") + req.originalUrl);
  console.log("request params: ");
  console.log(req.params);

  try {
    await jobOrderService.setToClosed(req.params.id);
    return res.status(200).send(`Successfully updated ${req.params.id}`);

  } catch(e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
};