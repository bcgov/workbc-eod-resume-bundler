const db = require('../db/db');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz',10);

// Get Job Orders //
export const getJobOrders = async () => {
    let jobOrders: any;

    await db.query(
        `SELECT job_orders.*, COUNT(submissions.job_id) AS submissions        
        FROM job_orders
        LEFT JOIN submissions
        ON (job_orders.job_id = submissions.job_id)
        GROUP BY
            job_orders.job_id`
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

    await db.query(
    `INSERT INTO job_orders (
        job_id, employer, position, start_date, deadline, location, vacancies, catchments,
        other_information, job_description, status, created_by, created_date)
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [jobID,
        body.employer,
        body.position,
        body.startDate,
        body.deadline,
        body.location,
        body.vacancies,
        body.catchments,
        body.otherInformation,
        body.jobDescriptionFile,
        body.status,
        body.user,
        new Date()
        ]
    )
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
    });

    return jobID;
}

// Create Job Order //
export const setToClosed = async (jobOrderID: string) => {
    await db.query(
    `UPDATE job_orders SET Status = 'Closed' WHERE job_id = '${jobOrderID}'`
    )
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
    });

    return;
}