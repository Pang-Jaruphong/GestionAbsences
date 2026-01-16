import express from "express";
import {dbhours} from '../db/dbhours.js'

const hoursRouter = express.Router();

hoursRouter.get("/", async (req, res) => {
    try {
        const hours = await dbhours.getAllHours();
        res.json(hours);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

export default hoursRouter;