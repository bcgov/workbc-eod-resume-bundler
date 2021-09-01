import { JobOrder } from "../interfaces/job-order.interface";
import { Submission, CreateSubmission, ClientApplication } from "../interfaces/submission.interface";

const db = require('../db/db');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz',10);

// Get Submissions //
export const getSubmissions = async () => {
    let res = null;

    await db.query(
        `SELECT 
          s.submission_id,
          s.job_id,
          s.catchment,
          s.centre,
          s.created_date,
          s.created_by,
          ca.client_application_id,
          ca.client_name,
          ca.client_case_number,
          ca.consent,
          ca.status,
          jo.employer,
          jo.position,
          jo.location
        FROM submissions s
        INNER JOIN job_orders jo ON jo.job_id = s.job_id
        LEFT JOIN client_applications ca ON ca.submission_id = s.submission_id`
      )
    .then((resp: any) => {
        let submissions: {[id: string]: Submission} = {};
        resp.rows.forEach((a: any) => {
          if (submissions[a.submission_id] == null){ // new dictionary entry
            let job: JobOrder = {
              jobOrderID: a.job_id,
              employer: a.employer,
              position: a.position,
              location: a.location
            }

            let applicant: ClientApplication = {
              clientName: a.client_name,
              clientCaseNumber: a.client_case_number,
              consent: a.consent,
              status: a.status
            }

            let submission: Submission = {
              submissionID: a.submission_id,
              jobID: a.job_id,
              catchment: a.catchment,
              centre: a.centre,
              jobOrderInfo: job,
              applicants: [applicant],
              createdDate: a.created_date,
              createdBy: a.created_by 
            }

            submissions[a.submission_id] = submission;
          }

          else{ // Submission already exists in dictionary
            let applicant: ClientApplication = {
              clientName: a.client_name,
              clientCaseNumber: a.client_case_number,
              consent: a.consent,
              status: a.status
            }

            submissions[a.submission_id].applicants.push(applicant);
          }
        });

        let submissionsToReturn: Submission[] = [];
        for (const key in submissions){ // Clean up return object
          submissionsToReturn.push(submissions[key]);
        }

        res = { count: resp.rowCount, submissions: submissionsToReturn };
    })
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
      });

    return res;
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
          client_application_id, submission_id, catchment, centre, client_name, client_case_number, consent, status, created_by, created_date)
          VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [clientApplicationID,
          submissionID,
          createBody.catchment,
          createBody.centre,
          applicant.clientName,
          applicant.clientCaseNumber,
          applicant.consent,
          "Active",
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