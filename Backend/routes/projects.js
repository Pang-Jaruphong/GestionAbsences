import express from "express";
import {dbprojects} from '../db/dbprojects.js'

const projectsRouter = express.Router();

projectsRouter.get("/", async (req, res) => {
    try {
        const projects = await dbprojects.getAllprojects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

export default projectsRouter;