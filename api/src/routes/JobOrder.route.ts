import * as express from "express";
import * as jobOrderController from "../controllers/JobOrder.controller";
export const router = express.Router();

router.get("/", jobOrderController.getJobOrders);
router.post("/", jobOrderController.createJobOrder);
router.post("/:id/setClosed", jobOrderController.setToClosed);

module.exports = router;