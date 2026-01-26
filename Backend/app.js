import express from 'express';
import cors from 'cors';

import studentsRouter from "./routes/students.js";
import projectsRouter from "./routes/projects.js";
import teachersRouter from "./routes/teachers.js";
import absencesRouter from "./routes/absences.js";
import classesRouter from "./routes/classes.js";
import hoursRouter from "./routes/hours.js";
import classesHoursRouter from "./routes/classesHours.js";

import authRouter from "./routes/auth.js"

const app = express();

const port = process.env.PORT || 4000;


// Autorise le frontend à parler au backend
app.use(cors());
app.use(express.json());

app.use('/projects', projectsRouter);
app.use('/students', studentsRouter);
app.use('/teachers', teachersRouter);
app.use('/absences', absencesRouter);
app.use('/classes', classesRouter);
app.use('/hours', hoursRouter);
app.use('/classesHours', classesHoursRouter)

// Importer les routes authentification
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Système de gestion des absences opérationnel !');
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});