import express from "express";
import {
    createContact,
    getAllContacts,
    updateContactStatus,
    deleteContact
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", getAllContacts);
router.put("/:id/status", updateContactStatus);
router.delete("/:id", deleteContact);

export default router;
