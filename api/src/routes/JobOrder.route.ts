import * as express from "express"
import * as jobOrderController from "../controllers/JobOrder.controller"

const router = express.Router()

router.get("/", jobOrderController.getJobOrders)
router.post("/", jobOrderController.createJobOrder)
router.put("/:id/setClosed", jobOrderController.setToClosed)
router.put("/:id/setOpen", jobOrderController.setToOpen)
router.put("/:jobID", jobOrderController.editJobOrder)
router.get("/:jobID/downloadJobDescription", jobOrderController.downloadJobDescription)

export default router
