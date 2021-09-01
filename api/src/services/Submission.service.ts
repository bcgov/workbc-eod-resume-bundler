import { CreateSubmission } from "../interfaces/submission.interface";

const db = require('../db/db');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz',10);

// Get Submissions //
export const getSubmissions = async () => {
    let submissions: any;

    await db.query(
        `SELECT 
          s.*,
          jo.employer,
          jo.position,
          jo.location
           FROM submissions s
        INNER JOIN job_orders jo ON jo.job_id = s.job_id`
      )
    .then((resp: any) => {
        submissions = { count: resp.rowCount, submissions: resp.rows };
    })
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
      });

    return submissions;
}

// Create Submission //
export const createSubmission = async (createBody: CreateSubmission) => {
  const submissionID: string = nanoid();

  await db.query(
    `INSERT INTO submissions (
        submission_id, job_id, catchment, centre, bundled, created_by, created_date)
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7)`,
        [submissionID,
        createBody.jobID,
        createBody.catchment,
        createBody.centre,
        false,
        createBody.user,
        new Date()
        ]
  )
  .then(() => {
    createBody.applicants.forEach(async applicant => {
      const clientApplicationID: string = nanoid();
      await db.query(
        `INSERT INTO client_applications (
          client_application_id, submission_id, catchment, centre, client_name, client_case_number, consent, created_by, created_date)
          VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [clientApplicationID,
          submissionID,
          createBody.catchment,
          createBody.centre,
          applicant.clientName,
          applicant.clientCaseNumber,
          applicant.consent,
          createBody.user,
          new Date()
          ]
      )
      .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
      });
    })
  })
  .catch((err: any) => {
    console.error("error while querying: ", err);
    throw new Error(err.message);
  });

  return submissionID;
}