import * as express from "express";
import * as submissionController from "../controllers/Submission.controller";
export const router = express.Router();

router.get("/", submissionController.getSubmissions);
router.get("/:submissionID/applications/:applicationID/downloadResume", submissionController.downloadResume);

router.post("/bundleAndSend", submissionController.bundleAndSend);
router.post("/", submissionController.createSubmission);
router.post("/setClientsToApproved", submissionController.setClientsToApproved);
router.post("/setClientsToFlagged", submissionController.setClientsToFlagged);

router.put("/:submissionID/applications/:applicationID", submissionController.editClientApplication);

module.exports = router;