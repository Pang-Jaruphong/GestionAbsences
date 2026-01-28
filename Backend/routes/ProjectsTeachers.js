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

projectsTeachersRouter.get("/groupes/:id", async (req, res) => {
    try {
        const projectsId = req.params.id; // Récupérer le "1" de l'URL
        const results = await dbProjectsTeachers.getAllProjectsById(projectsId);

        if (results.length === 0) {
            return res.status(404).json({ message: "Aucun projet trouvé pour cette ID." });
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

projectsTeachersRouter.get("/projects/absences/:id", async (req, res) => {
    try {
        const projectsId = req.params.id; // Récupérer le "1" de l'URL
        const results = await dbProjectsTeachers.getProjectsAbsencesById(projectsId);

        if (results.length === 0) {
            return res.status(404).json({ message: "Aucun projet trouvé pour cette ID." });
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

export default projectsTeachersRouter;