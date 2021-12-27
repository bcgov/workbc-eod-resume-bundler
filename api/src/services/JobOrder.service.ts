import { UpdateJobOrder } from "../interfaces/JobOrder.interface";

const db = require('../db/db');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz',10);

// Get Job Orders //
export const getJobOrders = async () => {
    let jobOrders: any;

    await db.query(
        `SELECT jo.*, COUNT(s.job_id) AS submissions        
        FROM job_orders jo
        LEFT JOIN submissions s ON jo.job_id = s.job_id
        GROUP BY
            jo.job_id`
      )
    .then((resp: any) => {
        jobOrders = { count: resp.rowCount, jobs: resp.rows };
    })
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
      });

    return jobOrders;
}

// Create Job Order //
export const createJobOrder = async (body: any) => {
    const jobID: string = nanoid();
    const currDate: Date = new Date();
    const startDate: Date = new Date(body.startDate);

    await db.query(
    `INSERT INTO job_orders (
        job_id, employer, position, start_date, deadline, location, vacancies, catchments,
        minimum_requirements, other_information, job_description, status, created_by, created_date)
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [jobID,
        body.employer,
        body.position,
        body.startDate,
        body.deadline,
        body.location,
        body.vacancies,
        body.catchments
            .map((c: any) => c.catchment_id)
            .sort((a: number, b: number) => { return a - b }),
        body.minimumRequirements,
        body.otherInformation,
        body.jobDescriptionFile,
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