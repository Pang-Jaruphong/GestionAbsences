import express from "express";
import {dbstudents} from '../db/dbstudents.js'

const studentsRouter = express.Router();

studentsRouter.get("/", async (req, res) => {
    try {
        const students = await dbstudents.getAllStudents();
        res.json(students);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

export default studentsRouter;