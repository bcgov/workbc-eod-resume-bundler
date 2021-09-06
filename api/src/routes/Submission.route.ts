import * as express from "express";
import * as submissionController from "../controllers/Submission.controller";
export const router = express.Router();

router.get("/", submissionController.getSubmissions);
router.post("/", submissionController.createSubmission);
router.get("/:submissionID/applications/:applicationID/downloadResume", submissionController.downloadResume);

module.exports = router;