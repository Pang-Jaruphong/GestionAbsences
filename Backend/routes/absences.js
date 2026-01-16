import express from "express";
import {dbabsences} from '../db/dbabsences.js'

const absencesRouter = express.Router();

absencesRouter.get("/", async (req, res) => {
    try {
        const absences = await dbabsences.getAllAbsences();
        res.json(absencess);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

export default absencesRouter();