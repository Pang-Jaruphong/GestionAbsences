import express from "express";
import {dbteachers} from '../db/dbteachers.js'

const teachersRouter = express.Router();

teachersRouter.get("/", async (req, res) => {
    try {
        const teachers = await dbteachers.getAllTeachers();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

export default teachersRouter;