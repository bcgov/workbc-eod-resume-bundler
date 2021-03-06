import * as express from "express";
import { ValidationError } from "yup";
import { BundleEmailParams, CreateSubmission, NotifyParams, UpdateClientApplication } from "../interfaces/Submission.interface";
import { SubmissionValidationSchema } from "../schemas/SubmissionValidationSchema";
import * as submissionService from "../services/Submission.service";

// Get Submissions //
export const getSubmissions = async (req: express.Request, res: express.Response) => {
  console.log("GET request received to " + req.get("host") + req.originalUrl);
  console.log("request headers: ");
  console.log(req.headers);

  try {
    let user: string = <string>req.headers.user;
    let isManager: boolean = <boolean><unknown>req.headers.ismanager; // need to cast to unknown before casting to boolean
    let managesCatchments: string[] = req.headers.managescatchments ? <string[]>JSON.parse(<string>req.headers.managescatchments) : [];
    let submissions: any = await submissionService.getSubmissions(user, isManager, managesCatchments);
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
        user: req.body.user,
        email: req.body.email
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
  console.log("PUT request received to " + req.get("host") + req.originalUrl);
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
  console.log("PUT request received to " + req.get("host") + req.originalUrl);
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

// Set Application to Do Not Bundle //
export const setClientToDoNotBundle = async (req: any, res: express.Response) => {
  console.log("PUT request received to " + req.get("host") + req.originalUrl);
  console.log("request params: ");
  console.log(req.params);

  try {
    let applicantID = req.params.applicationID;
    await submissionService.setClientToDoNotBundle(applicantID);
    return res.status(200).json("Client application successfully set to Do Not Bundle");

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
    let emailParams: BundleEmailParams = 
      {
        email: req.body.email,
        position: req.body.position,
        location: req.body.location,
        staffName: req.body.staffName
      };

    console.log(emailParams);

    await submissionService.bundleAndSend(applicantIDs, emailParams);
    return res.status(200).send();

  } catch(e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
};

// Edit Client Application //
export const editClientApplication = async (req: express.Request, res: express.Response) => {
  console.log("PUT request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);

  try {
    let updateBody: UpdateClientApplication = //TODO: validation
      {
        catchmentID: req.body.catchment,
        centreID: req.body.centre,
        clientName: req.body.clientName,
        preferredName: req.body.preferredName,
        clientCaseNumber: req.body.clientCaseNumber,
        bundle: req.body.bundle,
        status: req.body.status,
        user: req.body.user 
      }
    await submissionService.editClientApplication(req.params.applicationID, updateBody);
    return res.status(200).send();

  } catch(e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
};

// Notify Client //
export const NotifyClient = async (req: express.Request, res: express.Response) => {
  console.log("GET request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);

  try {
    let notifyParams: NotifyParams = {
      email: req.body.email,
      clientCaseNumber: req.body.clientCaseNumber,
      location: req.body.location,
      position: req.body.position,
      status: req.body.status
    }
    await submissionService.NotifyClient(notifyParams);
    return res.status(200).send("Client Notified");

  } catch(e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
};