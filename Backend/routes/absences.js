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

absencesRouter.get("/Classes/:id", async (req, res) => {
    try {
        const classeId = req.params.id;
        const AbsencesClasses = await dbabsences.getAbsencesByClasses(classeId);
        if (AbsencesClasses.length === 0) {
            return res.status(404).json({ message: "Aucun élève trouvé pour cette classe." });
        }
        res.json(AbsencesClasses);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

absencesRouter.get("/Projects/:id", async (req, res) => {
    try {
        const projectId = req.params.id;
        const AbsencesProjects = await dbabsences.getAbsencesByProjects(projectId);
        if (AbsencesProjects.length === 0) {
            return res.status(404).json({ message: "Aucun élève absence de ce projet." });
        }
        res.json(AbsencesProjects);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});
absencesRouter.post('/add', async (req, res) => {
    try {
        const { Hours_id, Students_id} = req.body;

        if (!Hours_id || !Students_id) {
            return res.status(400).json({ message : "Données manquantes : élève ou heure"})
        }

        const newID = await dbabsences.createAbsences(Hours_id, Students_id);
        res.status(201).json({ message : "Absence enregistrée", id: newID});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});
absencesRouter.delete('/absences/:id', async (req, res) => {
    const absenceId = req.params.id;
    const teacherId = req.user.id;

    try {
        const result = await dbabsences.deleteAbsence(absenceId, teacherId);

        if (result.success) {
            res.status(200).json({ message: "Absence supprimée avec succès." });
        } else {
            res.status(403).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression." });
    }
});

export default absencesRouter;