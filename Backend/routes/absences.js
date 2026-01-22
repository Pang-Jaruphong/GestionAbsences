import express from "express";
import {dbabsences} from '../db/dbabsences.js'

const absencesRouter = express.Router();

absencesRouter.get("/", async (req, res) => {
    try {
        const absences = await dbabsences.getAllAbsences();
        res.json(absences);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

absencesRouter.get("/students/:id", async (req, res) => {
    try {
        // params pour utiliser l'id dans l'URL
        const id = req.params.id;
        const AbsencesStudents = await dbabsences.getAbsencesById(id);
        if (AbsencesStudents.length === 0) {
            return res.status(404).json({ message: "Aucun élève trouvé pour cette classe." });
        }
        res.json(AbsencesStudents);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

/*
absencesRouter.get("/ClassesAbsences/:id", async (req, res) => {
    try {
        const id = req.query.id;
        const classesAbsences = await dbabsences.getAbsencesByClasses(id);
        res.json(classesAbsences);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

 */

export default absencesRouter;