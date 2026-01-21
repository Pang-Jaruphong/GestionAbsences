import express from "express";
import {dbclassesHours} from '../db/dbclassesHours.js'

const classesHoursRouter = express.Router();

classesHoursRouter.get("/", async (req, res) => {
    try {
        const classes = await dbclassesHours.getAllClassesHours();
        res.json(classes);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

export default classesHoursRouter;