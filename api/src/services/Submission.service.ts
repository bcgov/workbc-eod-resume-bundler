const db = require('../db/db');

// Get Submissions //
export const getSubmissions = async () => {
    let submissions: any;

    await db.query(
        `SELECT * FROM job_referrals jr
        INNER JOIN job_orders jo ON jo.job_id = jr.job_id`
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