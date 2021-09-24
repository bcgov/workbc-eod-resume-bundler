import * as express from "express";
import * as submissionController from "../controllers/Submission.controller";
export const router = express.Router();

router.get("/", submissionController.getSubmissions);
router.get("/:submissionID/applications/:applicationID/downloadResume", submissionController.downloadResume);

router.post("/", submissionController.createSubmission);
router.post("/setClientsToApproved", submissionController.setClientsToApproved);
router.post("/setClientsToFlagged", submissionController.setClientsToFlagged);

module.exports = router;