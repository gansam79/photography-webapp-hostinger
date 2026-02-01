import express from "express";
import {
    createEnquiry,
    getAllEnquiries,
    updateEnquiryStatus,
    deleteEnquiry
} from "../controllers/enquiryController.js";

const router = express.Router();

router.post("/", createEnquiry);
router.get("/", getAllEnquiries);
router.put("/:id/status", updateEnquiryStatus);
router.delete("/:id", deleteEnquiry);

export default router;
