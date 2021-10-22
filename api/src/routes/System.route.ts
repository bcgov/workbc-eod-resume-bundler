import * as express from "express";
import * as systemController from "../controllers/System.controller";
export const router = express.Router();

router.get("/Catchments", systemController.getCatchments);
router.get("/Centres", systemController.getCentres);
router.get("/UserPermissions", systemController.getUserPermissions);

module.exports = router;