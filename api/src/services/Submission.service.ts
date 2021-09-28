import { JobOrder } from "../interfaces/JobOrder.interface";
import { Submission, CreateSubmission, ClientApplication, Resume } from "../interfaces/Submission.interface";
import nodemailer, { Transporter } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
const fs = require("fs");
const db = require('../db/db');
const PDFMerger = require('pdf-merger-js');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz',10);

// Get Submissions //
export const getSubmissions = async () => {
    let res = null;

    await db.query(
        `SELECT 
          s.submission_id,
          s.job_id,
          s.catchment_id,
          s.centre_id,
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
              catchmentID: a.catchment_id,
              centreID: a.centre_id,
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
  })
  .catch((err: any) => {
      console.error("error while querying: ", err);
      throw new Error(err.message);
    });

  return res;
}

// Create Submission //
export const createSubmission = async (createBody: CreateSubmission, files: any) => {
  const submissionID: string = nanoid();
  console.log(files);
  let applicants = JSON.parse(createBody.applicants.toString());
  await db.query(
    `INSERT INTO submissions (
        submission_id, job_id, catchment_id, centre_id, bundled, created_by, created_date)
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7)`,
        [submissionID,
        createBody.jobID,
        createBody.catchmentID,
        createBody.centreID,
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
          client_application_id, submission_id, catchment_id, centre_id, client_name, client_case_number, resume_file, resume_file_name, resume_file_type, consent, status, created_by, created_date)
          VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [clientApplicationID,
          submissionID,
          createBody.catchmentID,
          createBody.centreID,
          applicant.clientName,
          applicant.clientCaseNumber,
          files[applicant.applicantID].data,
          applicant.resume?.fileName,
          applicant.resume?.fileType,
          applicant.consent,
          "Pending", // default status is Pending
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

// Set Client Applications to Approved //
export const setClientsToApproved = async (applicantIDs: string[]) => {
  await db.query(
  `UPDATE client_applications SET Status = 'Approved' WHERE client_application_id IN (${applicantIDs.map(a => "'" + a + "'").join(',')})`
  )
  .catch((err: any) => {
      console.error("error while querying: ", err);
      throw new Error(err.message);
  });

  return;
}

// Set Client Applications to Flagged //
export const setClientsToFlagged = async (applicantIDs: string[]) => {
  await db.query(
  `UPDATE client_applications SET Status = 'Flagged' WHERE client_application_id IN (${applicantIDs.map(a => "'" + a + "'").join(',')})`
  )
  .catch((err: any) => {
      console.error("error while querying: ", err);
      throw new Error(err.message);
  });

  return;
}

// Bundle and Send PDF //
export const bundleAndSend = async (clientApplicationIDs: String[]) => {
  try {
      // Bundle PDFs //
      let mergedPdf: any = null;
      await db.query(
        `SELECT 
          client_application_id,
          encode(ca.resume_file, 'base64') AS resume_file
        FROM client_applications ca
        WHERE ca.client_application_id IN (${clientApplicationIDs.map(a => "'" + a + "'").join(',')})`
      )
      .then(async (resp: any) => {
        const merger = new PDFMerger();
        await Promise.all(resp.rows.map(async (row: any) => await merger.add(Buffer.from(row.resume_file, "base64"))));
        mergedPdf = await merger.saveAsBuffer();
      })
      .catch((err: any) => {
          console.error("error while querying: ", err);
          throw new Error(err.message);
      });

      // Send Emails //
      let transporter: Transporter = nodemailer.createTransport({
        host: "apps.smtp.gov.bc.ca",
        port: 25,
        secure: false,
        tls: {
            rejectUnauthorized: false
        } // true for 465, false for other ports
      });

      await transporter.verify()
      .then(function (r) {
          console.log("Transporter connected.")
          // send mail with defined transport object
          let message: MailOptions = {
              from: 'Resume Bundler <donotreply@gov.bc.ca>', // sender address
              to: 'branko.bajic@gov.bc.ca',// list of receivers
              subject: "pdf bundle", // Subject line
              html: "hi",
              attachments: [
                {
                  filename: "bundled-resumes.pdf",
                  content: mergedPdf,
                  contentType: "application/pdf"
                }
              ]
          };
          let info = transporter.sendMail(message, (error, info) => {
            if (error) {
                throw new Error("An error occurred while sending the email, please try again. If the error persists please try again later.");
            } else {
                console.log("Message sent: %s", info.messageId);
                return;
            }
          });
      }).catch(function (e) {
          console.log(e)
          throw new Error("Error connecting to transporter");
      });
  } catch (error) {
      console.log(error);
      throw new Error("Error bundling");
  }
}