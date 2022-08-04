import * as express from "express"
import * as systemController from "../controllers/System.controller"

const router = express.Router()

router.get("/Catchments", systemController.getCatchments)
router.get("/Centres", systemController.getCentres)
router.get("/UserPermissions", systemController.getUserPermissions)

export default router
