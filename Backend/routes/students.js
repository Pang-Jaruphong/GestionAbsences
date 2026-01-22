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

studentsRouter.get("/classes/:id", async (req, res) => {
    try {
        const classId = req.params.id; // Récupérer le "1" de l'URL
        const results = await dbstudents.getAllStudentsByClasses(classId);

        if (results.length === 0) {
            return res.status(404).json({ message: "Aucun élève trouvé pour cette classe." });
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

export default studentsRouter;