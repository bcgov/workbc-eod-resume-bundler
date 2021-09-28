const db = require('../db/db');

// Get Catchments //
export const getCatchments = async () => {
    let catchments: any;

    await db.query(
        `SELECT * FROM catchments`
      )
    .then((resp: any) => {
        catchments = resp.rows;
    })
    .catch((err: any) => {
        console.error("error while querying: ", err);
        throw new Error(err.message);
      });

    return catchments;
}

// Get Centres //
export const getCentres = async () => {
  let centres: any;

  await db.query(
      `SELECT * FROM centres`
    )
  .then((resp: any) => {
      centres = resp.rows;
  })
  .catch((err: any) => {
      console.error("error while querying: ", err);
      throw new Error(err.message);
    });

  return centres;
}