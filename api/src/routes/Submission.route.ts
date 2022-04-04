import * as express from "express";
import * as submissionController from "../controllers/Submission.controller";
export const router = express.Router();

router.get("/", submissionController.getSubmissions);
router.get("/:submissionID/applications/:applicationID/downloadResume", submissionController.downloadResume);

router.post("/bundleAndSend", submissionController.bundleAndSend);
router.post("/", submissionController.createSubmission);
router.put("/setClientsToApproved", submissionController.setClientsToApproved);
router.put("/setClientsToFlagged", submissionController.setClientsToFlagged);
router.put("/:submissionID/applications/:applicationID/setClientToDoNotBundle", submissionController.setClientToDoNotBundle);

router.put("/:submissionID/applications/:applicationID", submissionController.editClientApplication);
router.post("/:submissionID/applications/:applicationID/notify", submissionController.NotifyClient);

module.exports = router;