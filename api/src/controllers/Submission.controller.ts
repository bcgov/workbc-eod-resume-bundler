import * as express from "express";
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

// Create Submission //
export const createSubmission = async (req: express.Request, res: express.Response) => {
  console.log("POST request received to " + req.get("host") + req.originalUrl);
  console.log("request body: ");
  console.log(req.body);

  try {
    let createdID: string = await submissionService.createSubmission(req.body);
    return res.status(200).json({ createdID : createdID });

  } catch(e) {
    console.log(e);
    return res.status(500).send("Internal Server Error");
  }
};