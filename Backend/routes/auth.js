import express from "express";
import bcrypt from "bcrypt";
import {dbAuth} from '../db/dbAuth.js'

const authRouter = express.Router();

// Route pour l'inscription (Signup)
authRouter.post('/register', async (req, res) => {
    const { email, password} = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await dbAuth.findTeachersByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Créer l'utilisateur
        // Utiliser 'bcrypt' pour hacher le mot de passe ici
        const userId = await dbAuth.registerTeachers(email, password);

        res.status(201).json({ message: "Utilisateur créé avec succès !", id: userId });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'inscription." });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // Si l'utilisateur existe et si le mot de passe est bon
        const user = await dbAuth.findTeachersByEmail(Email, Password);

        if (!user) {
            return res.status(401).json({ message: "Email incorrect." });
        }

        // On compare le mot de passe (si tu utilises bcrypt)
        const isMatch = await bcrypt.compare(Password, user.password);

        if (user) {
            res.json({ message: "Connexion réussie !", user: user });
        } else {
            res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur." });
    }
});

export default  authRouter;