import express from "express";
import {
    getAllLoveStories,
    getLoveStoryById,
    createLoveStory,
    updateLoveStory,
    deleteLoveStory,
} from "../controllers/loveStoryController.js";

const router = express.Router();

router.get("/", getAllLoveStories);
router.get("/:id", getLoveStoryById);
router.post("/", createLoveStory);
router.put("/:id", updateLoveStory);
router.delete("/:id", deleteLoveStory);

export default router;
