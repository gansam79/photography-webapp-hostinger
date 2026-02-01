import express from "express";
import {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
} from "../controllers/testimonialController.js";

const router = express.Router();

router.post("/", createTestimonial);
router.get("/", getAllTestimonials);
router.get("/:id", getTestimonialById);
router.put("/:id", updateTestimonial);
router.delete("/:id", deleteTestimonial);

export default router;
