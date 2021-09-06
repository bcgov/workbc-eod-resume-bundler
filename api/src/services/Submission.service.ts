import { JobOrder } from "../interfaces/job-order.interface";
import { Submission, CreateSubmission, ClientApplication, Resume } from "../interfaces/submission.interface";
const fs = require("fs");
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
          if (submissions[a.submission_id] == null){ // case 1: new Submission
            let job: JobOrder = {
              jobOrderID: a.job_id,
              employer: a.employer,
              position: a.position,
              location: a.location
            }

            let applicant: ClientApplication = {
              clientApplicationID: a.client_application_id,
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

          else{ // case 2: Submission already exists in dictionary
            let applicant: ClientApplication = {
              clientApplicationID: a.client_application_id,
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

// Download Resume //
export const downloadResume = async (clientApplicationID: string) => {
  let res: Resume | null = null;
  await db.query(
      `SELECT 
        ca.resume_file_name,
        ca.resume_file_type,
        encode(ca.resume_file, 'base64') AS resume_file
      FROM client_applications ca
      WHERE ca.client_application_id = '${clientApplicationID}'`
    )
  .then((resp: any) => {
      let r = resp.rows[0];
      res = {
        fileName: r.resume_file_name,
        fileType: r.resume_file_type,
        buffer: r.resume_file
      }
      fs.writeFile("test.pdf", r.resume_file, "base64", function (err: any) {
        if (err) return console.log(err);
      });

  })
  .catch((err: any) => {
      console.error("error while querying: ", err);
      throw new Error(err.message);
    });

  return res;
}

// Create Submission //
export const createSubmission = async (createBody: CreateSubmission, file: any) => {
  const submissionID: string = nanoid();
  let applicants = JSON.parse(createBody.applicants.toString());
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
    applicants.forEach(async (applicant: any) => {
      const clientApplicationID: string = nanoid();
      await db.query(
        `INSERT INTO client_applications (
          client_application_id, submission_id, catchment, centre, client_name, client_case_number, resume_file, resume_file_name, resume_file_type, consent, status, created_by, created_date)
          VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [clientApplicationID,
          submissionID,
          createBody.catchment,
          createBody.centre,
          applicant.clientName,
          applicant.clientCaseNumber,
          file.data,
          applicant.resume?.fileName,
          applicant.resume?.fileType,
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

function _base64ToArrayBuffer(base64: any) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}