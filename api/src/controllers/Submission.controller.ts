import * as express from "express";
import { ValidationError } from "yup";
import { CreateSubmission } from "../interfaces/Submission.interface";
import { SubmissionValidationSchema } from "../schemas/SubmissionValidationSchema";
import * as submissionService from "../services/Submission.service";

// Get Submissions //
export const getSubmissions = async (req: express.Request, res: express.Response) => {
  console.log("GET request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);

  try {
    let submissions: any = await submissionService.getSubmissions();
    return res.status(200).json(submissions);

  } catch(e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
};

// Download Resume //
export const downloadResume = async (req: express.Request, res: express.Response) => {
  console.log("GET request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);

  try {
    let resume: any = await submissionService.downloadResume(req.params.applicationID);
    return res.status(200).json(resume);

  } catch(e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
};

// Create Submission //
export const createSubmission = async (req: any, res: express.Response) => {
  console.log("POST request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);

  try {
    SubmissionValidationSchema.validate(req.body, { abortEarly: false })
    .then(async () => {
      let body: CreateSubmission = {
        catchmentID: req.body.catchment,
        centreID: req.body.centre,
        jobID: req.body.jobID,
        applicants: req.body.applicants,
        user: req.body.user
      }

      let createdID: string = await submissionService.createSubmission(body, req.files);
      return res.status(200).json({ createdID : createdID });
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

// Set Clients to Approved //
export const setClientsToApproved = async (req: any, res: express.Response) => {
  console.log("POST request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);

  try {
    let applicantIDs = req.body;

    await submissionService.setClientsToApproved(applicantIDs);
    return res.status(200).json("Client applications successfully set to Approved");

  } catch(e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
};

// Set Clients to Flagged //
export const setClientsToFlagged = async (req: any, res: express.Response) => {
  console.log("POST request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);

  try {
    let applicantIDs = req.body;

    await submissionService.setClientsToFlagged(applicantIDs);
    return res.status(200).json("Client applications successfully set to Flagged");

  } catch(e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
};

// Bundle and Send Emails //
export const bundleAndSend = async (req: express.Request, res: express.Response) => {
  console.log("GET request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);

  try {
    let applicantIDs = req.body.clientApplicationIDs;

    await submissionService.bundleAndSend(applicantIDs);
    return res.status(200).send();

  } catch(e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
};