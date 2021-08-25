import * as express from "express";
import * as submissionController from "../controllers/Submission.controller";
export const router = express.Router();

router.get("/", submissionController.getSubmissions);

module.exports = router;