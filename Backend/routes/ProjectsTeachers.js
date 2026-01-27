import express from "express";
import {dbProjectsTeachers} from '../db/dbProjectsTeachers.js'

const projectsTeachersRouter = express.Router();

projectsTeachersRouter.get("/", async (req, res) => {
    try {
        const projectsTeachers = await dbProjectsTeachers.getAllProjectsTeachers();
        res.json(projectsTeachers);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

export default projectsTeachersRouter;