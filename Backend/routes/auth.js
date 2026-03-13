import express from "express";
import bcrypt from "bcrypt";
import {dbAuth} from '../db/dbAuth.js'
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.post('/createPW', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await dbAuth.findTeachersByEmail(email);
        if (!user || user.password) {
            return res.status(400).json({ message: "Action non autorisée." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await dbAuth.updateTeacherPassword(email, hashedPassword);

        res.json({ message: "Mot de passe créé avec succès." });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route pour l'inscription (Signup)
authRouter.post('/register', async (req, res) => {
    const { email, password} = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await dbAuth.findTeachersByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        // Utiliser 'bcrypt' pour hacher le mot de passe ici
        const userId = await dbAuth.registerTeachers(email, hashedPassword);

        res.status(201).json({ message: "Utilisateur créé avec succès !", id: userId });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'inscription." });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Sécurité : vérifier si les données existent
        if (!email || !password) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs." });
        }

        // Si l'utilisateur existe et si le mot de passe est bon
        const user = await dbAuth.findTeachersByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Email incorrect." });
        }

        // première connexion
        if (!user.password) {
            return res.status(200).json({
                firstLogin: true,
                message: "Première connexion – crée ton mot de passe"
            });
        }

        // On compare le mot de passe (si tu utilises bcrypt)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.SECRET_KEY,
            { expiresIn: "2h" }
        )

        res.json({
            message: "Connexion réussie !",
            token: token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur." });
    }
});
export default  authRouter;