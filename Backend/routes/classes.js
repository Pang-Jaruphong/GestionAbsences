import express from "express";
import {dbclasses} from '../db/dbclasses.js'

const classesRouter = express.Router();

classesRouter.get("/", async (req, res) => {
    try {
        const classes = await dbclasses.getAllclasses();
        res.json(classes);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

export default classesRouter;