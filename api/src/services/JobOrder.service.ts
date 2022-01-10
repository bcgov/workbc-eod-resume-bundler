import { JobDescription, UpdateJobOrder } from "../interfaces/JobOrder.interface";

const db = require('../db/db');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz',10);

// Get Job Orders //
export const getJobOrders = async () => {
    let jobOrders: any;
    const currDate: Date = new Date();

    await db.query(
        `SELECT jo.*, COUNT(s.job_id) AS submissions        
        FROM job_orders jo
        LEFT JOIN submissions s ON jo.job_id = s.job_id
        GROUP BY
            jo.job_id`
      )
    .then(async (resp: any) => {
        // Update upcoming jobs if needed //
        let jobsToUpdate: string[] = [];
        resp.rows.forEach((row: any) => {
            if (row.status.toLowerCase() === "upcoming" && row.start_date <= currDate){
                jobsToUpdate.push(row.job_id);
            }
        });
        if (jobsToUpdate.length > 0){
            await db.query(
                `UPDATE job_orders SET Status = 'Open' WHERE job_id = ANY ($1)`,
                [jobsToUpdate]
            )
            .then((updateResp: any) => {
                return getJobOrders();
            })
        }
        jobOrders = { count: resp.rowCount, jobs: resp.rows };
    })
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
      });

    return jobOrders;
}

// Create Job Order //
export const createJobOrder = async (body: any, files: any) => {
    const jobID: string = nanoid();
    const currDate: Date = new Date();
    const startDate: Date = new Date(body.startDate);

    await db.query(
    `INSERT INTO job_orders (
        job_id, employer, position, start_date, deadline, location, vacancies, catchments,
        minimum_requirements, other_information, job_description_file, job_description_file_name,
        job_description_file_type, status, created_by, created_date)
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [jobID,
        body.employer,
        body.position,
        body.startDate,
        body.deadline,
        body.location,
        body.vacancies,
        JSON.parse(body.catchments)
            .map((c: any) => c.catchment_id)
            .sort((a: number, b: number) => { return a - b }),
        body.minimumRequirements,
        body.otherInformation,
        files["jobDescription"].data,
        files["jobDescription"].name,
        files["jobDescription"].mimetype,
        startDate.getTime() > currDate.getTime() ? "Upcoming" : "Open", // status
        body.user,
        currDate
        ]
    )
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
    });

    return jobID;
}

// Close Job Order //
export const setToClosed = async (jobOrderID: string) => {
    await db.query(
    `UPDATE job_orders SET Status = 'Closed' WHERE job_id = $1`, [jobOrderID]
    )
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
    });

    return;
}

// Open Job Order //
export const setToOpen = async (jobOrderID: string) => {
    await db.query(
    `UPDATE job_orders SET Status = 'Open' WHERE job_id = $1`, [jobOrderID]
    )
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
    });

    return;
}

// Edit Job Order //
export const editJobOrder = async (jobID: string, updateBody: UpdateJobOrder) => {
    await db.query(
        ` UPDATE job_orders
          SET employer = $1,
              position = $2,
              start_date = $3,
              deadline = $4,
              catchments = $5,
              edited_by = $6,
              edited_date = CURRENT_DATE
            WHERE job_id = $7`,
        [
            updateBody.employer,
            updateBody.position,
            updateBody.startDate,
            updateBody.deadline,
            updateBody.catchments,
            updateBody.user,
            jobID
        ]
    )
    .then((resp: any) => {
      return;
    })
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
    });
}

// Download Job Description //
export const downloadJobDescription = async (jobID: string) => {
    let jobDesc: JobDescription | null = null;
    await db.query(
        `SELECT 
          jo.job_description_file_name,
          jo.job_description_file_type,
          encode(jo.job_description_file, 'base64') AS job_description_file
        FROM job_orders jo
        WHERE jo.job_id = $1`,
        [jobID]
      )
    .then((resp: any) => {
        let r = resp.rows[0];
        jobDesc = {
          fileName: r.job_description_file_name,
          fileType: r.job_description_file_type,
          buffer: r.job_description_file
        }
    })
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
      });
  
    return jobDesc;
}