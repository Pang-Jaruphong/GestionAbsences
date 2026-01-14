import express from 'express';

const app = express();
const port = 4000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Système de gestion des absences opérationnel !');
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});