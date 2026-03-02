import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {dbAuth} from '../db/dbAuth.js';
import { sendAuthEmail } from '../services/emailService.js';

const authRouter = express.Router();

// --- 1. REQUEST ACCESS (Send Email with Token) ---
// Used for both first-time password setup and password resets
authRouter.post('/request-access', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await dbAuth.findTeachersByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Generate a 20-minute Token
        const token = jwt.sign(
            { email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '20m' } 
        );

        // If user has no password yet, it's a 'setup', otherwise it's a 'reset'
        const mailType = user.password ? 'reset' : 'setup';
        await sendAuthEmail(user.email, token, mailType);

        res.json({ message: "Verification email sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error occurred while sending the email." });
    }
});

// --- 2. VERIFY AND SETUP (Update Password) ---
// This is the endpoint the Frontend calls when the user clicks the email link
authRouter.post('/verify-and-setup', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify token (If 20 mins passed, it throws an error)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // Hash the new password and update in DB
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await dbAuth.updateTeacherPassword(email, hashedPassword);

        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        // Handle JWT verification error (Expired or invalid)
        res.status(401).json({ message: "The link is invalid or has expired (20 min limit)." });
    }
});

// --- 3. LOGIN ---
authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        const user = await dbAuth.findTeachersByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Incorrect email." });
        }

        // Check if it's the first login (password field is empty)
        if (!user.password) {
            return res.status(200).json({
                firstLogin: true,
                message: "First login detected – please check your email to create a password."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect email or password." });
        }

        res.json({
            message: "Login successful!",
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// --- 4. REGISTER (Optional Manual Signup) ---
authRouter.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await dbAuth.findTeachersByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "This email is already in use." });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await dbAuth.registerTeachers(email, hashedPassword);

        res.status(201).json({ message: "User created successfully!", id: userId });
    } catch (error) {
        res.status(500).json({ error: "Error during registration." });
    }
});

/*authRouter.post('/createPW', async (req, res) => {
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
        res.json({
            message: "Connexion réussie !",
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur." });
    }

    
}); */

/*
// --- TEST EMAIL (Now outside and accessible) ---
authRouter.get('/test-email', async (req, res) => {
    try {
        const testToken = "12345_test_token";
        const myEmail = process.env.EMAIL_USER; 
        
        await sendAuthEmail(myEmail, testToken, 'setup');
        res.send("Test email sent! Check your inbox (and spam folder).");
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).send("Failed to send email: " + error.message);
    }
});
*/
export default  authRouter;