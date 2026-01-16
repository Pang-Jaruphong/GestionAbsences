import express from 'express';

import studentsRouter from "./routes/students.js";
import projectsRouter from "./routes/projects.js";
import teachersRouter from "./routes/teachers.js";
import absencesRouter from "./routes/absences.js";
import classesRouter from "./routes/classes.js";
import hoursRouter from "./routes/hours.js";

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use('/projects', projectsRouter);
app.use('/students', studentsRouter);
app.use('/teachers', teachersRouter);
app.use('/absences', absencesRouter);
app.use('/classes', classesRouter);
app.use('/hours', hoursRouter);

app.get('/', (req, res) => {
    res.send('Système de gestion des absences opérationnel !');
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});