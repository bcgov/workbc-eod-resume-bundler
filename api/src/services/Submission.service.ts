import { JobOrder } from "../interfaces/JobOrder.interface";
import { Submission, CreateSubmission, ClientApplication, Resume, UpdateClientApplication } from "../interfaces/Submission.interface";
import nodemailer, { Transporter } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
const fs = require("fs");
const db = require('../db/db');
const PDFMerger = require('easy-pdf-merge');
const flattener = require('pdf-flatten');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz',10);
const hummus = require('hummus');
const memoryStreams = require('memory-streams');

// Get Submissions //
export const getSubmissions = async (user: string) => {
    let res = null;

    await db.query(
        `SELECT 
          s.submission_id,
          s.job_id,
          ca.catchment_id,
          cat.name AS catchment_name,
          ca.centre_id,
          cen.name AS centre_name,
          s.created_date,
          s.created_by,
          ca.client_application_id,
          ca.client_name,
          ca.preferred_name,
          ca.client_case_number,
          ca.consent,
          ca.status,
          ca.bundled,
          ca.resume_file_name,
          ca.resume_file_type,
          jo.employer,
          jo.position,
          jo.location,
          jo.start_date,
          jo.deadline
        FROM submissions s
        INNER JOIN job_orders jo ON jo.job_id = s.job_id
        LEFT JOIN client_applications ca ON ca.submission_id = s.submission_id
        LEFT JOIN catchments cat ON cat.catchment_id = ca.catchment_id
        LEFT JOIN centres cen ON cen.centre_id = ca.centre_id
        WHERE s.created_by = '${user}'`
      )
    .then((resp: any) => {
        let submissions: {[id: string]: Submission} = {};
        resp.rows.forEach((a: any) => {
          let resume: Resume = {
            fileName: a.resume_file_name,
            fileType: a.resume_file_type
          }
          
          if (submissions[a.submission_id] == null){ // case 1: new Submission
            let job: JobOrder = {
              jobOrderID: a.job_id,
              employer: a.employer,
              position: a.position,
              location: a.location,
              startDate: a.start_date,
              deadline: a.deadline
            }

            let applicant: ClientApplication = {
              clientApplicationID: a.client_application_id,
              clientName: a.client_name,
              preferredName: a.preferred_name,
              clientCaseNumber: a.client_case_number,
              consent: a.consent,
              status: a.status,
              resume: resume,
              bundled: a.bundled,
              catchmentID: a.catchment_id,
              catchmentName: a.catchment_name,
              centreID: a.centre_id,
              centreName: a.centre_name
            }

            let submission: Submission = {
              submissionID: a.submission_id,
              jobID: a.job_id,
              catchmentID: a.catchment_id,
              catchmentName: a.catchment_name,
              centreID: a.centre_id,
              centreName: a.centre_name,
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
              preferredName: a.preferred_name,
              clientCaseNumber: a.client_case_number,
              consent: a.consent,
              status: a.status,
              resume: resume,
              bundled: a.bundled,
              catchmentID: a.catchment_id,
              catchmentName: a.catchment_name,
              centreID: a.centre_id,
              centreName: a.centre_name
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
          client_application_id, submission_id, catchment_id, centre_id, client_name, preferred_name, client_case_number, resume_file, resume_file_name, resume_file_type, consent, status, created_by, created_date)
          VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [clientApplicationID,
          submissionID,
          createBody.catchmentID,
          createBody.centreID,
          applicant.clientName,
          applicant.preferredName,
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
export const bundleAndSend = async (clientApplicationIDs: String[], email: String) => {
  try {
      // Bundle PDFs //
      let mergedPDF: Buffer;
      await db.query(
        `SELECT 
          client_application_id,
          encode(ca.resume_file, 'base64') AS resume_file
        FROM client_applications ca
        WHERE ca.client_application_id IN (${clientApplicationIDs.map(a => "'" + a + "'").join(',')})`
      )
      .then(async (resp: any) => {
        // Merge all the pdfs //
        await Promise.all(resp.rows.map(async (row: any) => {
          const pdf: Buffer = Buffer.from(row.resume_file, "base64");
          mergedPDF = combinePDFBuffers(mergedPDF, pdf);
        }));
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
      .then(async function (r) {
          console.log("Transporter connected.")
          // send mail with defined transport object
          let message: MailOptions = {
              from: 'Resume Bundler <donotreply@gov.bc.ca>', // sender address
              to: <string>email, // list of receivers TODO
              subject: "New Bundled Resumes", // subject line
              html: "Please see attached for bundled resumes", // email body
              attachments: [
                {
                  filename: "bundled-resumes.pdf",
                  content: mergedPDF,
                  contentType: "application/pdf"
                }
              ]
          };
          transporter.sendMail(message, (error, info) => {
            if (error) {
                throw new Error("An error occurred while sending the email, please try again. If the error persists please try again later.");
            } else {
                console.log("Message sent: %s", info.messageId);
                return;
            }
          });

          await db.query( // Set bundled statuses to true
            `UPDATE client_applications SET Bundled = true WHERE client_application_id IN (${clientApplicationIDs.map(a => "'" + a + "'").join(',')})`
          )
          .catch((err: any) => {
            console.error("error while querying: ", err);
            throw new Error(err.message);
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

// Edit Client Application //
export const editClientApplication = async (clientApplicationID: string, updateBody: UpdateClientApplication) => {
  await db.query(
      ` UPDATE client_applications
        SET catchment_id = ${updateBody.catchmentID},
            centre_id = ${updateBody.centreID},
            client_name = '${updateBody.clientName}',
            preferred_name = '${updateBody.preferredName}',
            client_case_number = '${updateBody.clientCaseNumber}',
            edited_by = '${updateBody.user}',
            edited_date = CURRENT_DATE
      WHERE client_application_id = '${clientApplicationID}'`
    )
  .then((resp: any) => {
    return;
  })
  .catch((err: any) => {
      console.error("error while querying: ", err);
      throw new Error(err.message);
    });
}




// HELPER FUNCTIONS //
const combinePDFBuffers = (firstBuffer: Buffer, secondBuffer: Buffer) => {
  if (!firstBuffer)
    return secondBuffer;
    
  var outStream = new memoryStreams.WritableStream();

  try {
      var firstPDFStream = new hummus.PDFRStreamForBuffer(firstBuffer);
      var secondPDFStream = new hummus.PDFRStreamForBuffer(secondBuffer);

      var pdfWriter = hummus.createWriterToModify(firstPDFStream, new hummus.PDFStreamForResponse(outStream));
      pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
      pdfWriter.end();
      var newBuffer = outStream.toBuffer();
      outStream.end();

      return newBuffer;
  }
  catch(e){
      outStream.end();
      if (e instanceof Error) {
        throw new Error('Error during PDF combination: ' + e.message);
      }
  }
};