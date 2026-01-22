import express from "express";
import {dbabsences} from '../db/dbprojectHasTeachers.js'

const Projects_as_TeachersRouter = express.Router();

Project_as_TeacherRouter.get("/", async (req, res) => {
    try {
        const project_as_teachers = await dbprojectHasTeachers.getAllTeachers();
        res.json(project_as_teachers);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

Project_as_TeacherRouter.get()