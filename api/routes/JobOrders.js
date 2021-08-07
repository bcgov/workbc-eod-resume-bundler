const Router = require('express-promise-router');
const router = new Router();
const db = require('../db/db');

const yup = require('yup');
var JobOrderValidationSchema = require('../schemas/JobOrderValidationSchema');

const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz',10);

// GET Job Orders //
router.get("/", async (req, res) => {
  db.query(
    `SELECT * FROM job_orders`
  )
  .then((jobOrders) => {
    res.status(200).send(
      {
        result: jobOrders
      }
    )}
  )
  .catch((err) => {
    console.error("error while querying: ", err);
    res.status(500).send();
  });
});

// POST Job Order //
router.post("/", async (req,res) => {
  const jobID = nanoid();

  JobOrderValidationSchema.validate(req.body, { abortEarly: false })
  .then(async () => {
    db.query(
      `INSERT INTO job_orders (
        job_id, employer, position, start_date, deadline, location, vacancies, catchments,
        other_information, job_description, status, created_by, created_date)
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [jobID,
        req.body.employer,
        req.body.position,
        req.body.startDate,
        req.body.deadline,
        req.body.location,
        req.body.vacancies,
        req.body.catchments,
        req.body.otherInformation,
        req.body.jobDescriptionFile,
        req.body.status,
        req.body.user,
        new Date()
        ]
    )
    .then(() => {
      res.status(201).send(
        {
          createdID: jobID
        });
    })
    .catch((err) => {
      console.error("error while querying: ", err);
      res.status(500).send();
    });
  })
  .catch((validationErrors) => {
    console.error("validation unsuccessful: ", validationErrors);
    res.status(400).send(validationErrors);
  });
});

module.exports = router
