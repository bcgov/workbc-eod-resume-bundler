import * as express from "express";
import * as submissionController from "../controllers/Submission.controller";
export const router = express.Router();

router.get("/", submissionController.getSubmissions);
router.post("/", submissionController.createSubmission);

module.exports = router;