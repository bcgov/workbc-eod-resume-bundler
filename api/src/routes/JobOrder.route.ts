import * as express from "express";
import * as jobOrderController from "../controllers/JobOrder.controller";
export const router = express.Router();

router.get("/", jobOrderController.getJobOrders);
router.post("/", jobOrderController.createJobOrder);
router.put("/:id/setClosed", jobOrderController.setToClosed);
router.put("/:id/setOpen", jobOrderController.setToOpen);
router.put("/:id/setDeleted", jobOrderController.setToDeleted);
router.put("/:jobID", jobOrderController.editJobOrder);
router.get("/:jobID/downloadJobDescription", jobOrderController.downloadJobDescription);

module.exports = router;