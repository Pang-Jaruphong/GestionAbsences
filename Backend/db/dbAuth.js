import { db } from './database.js'; // Import de ton objet db
import bcrypt from 'bcrypt'; // hasher le mot de passe

const dbAuth = {
    updateTeacherPassword: async (email, hashedPassword) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const [result] = await con.execute(
                'UPDATE teachers SET password = ? WHERE email = ?',
                [hashedPassword, email]
            );
            return result;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du mot de passe:", error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },

    // Fonction pour vérifier si un utilisateur existe
    findTeachersByEmail: async (email) => {
        let con;
        try {
            // On ouvre la connexion via ta méthode
            con = await db.connectToDatabase();

            // On exécute la requête
            const [rows] = await con.execute(
                'SELECT * FROM teachers WHERE email = ?',
                [email]
            );

            return rows[0]; // Retourne l'utilisateur ou undefined
        } catch (error) {
            console.error("Erreur lors de la recherche de l'utilisateur:", error);
            throw error;
        } finally {
            // IMPORTANT : On ferme la connexion quoi qu'il arrive
            if (con) {
                await db.disconnectFromDatabase(con);
            }
        }
    },

    // Fonction pour créer un utilisateur (Inscription)
    registerTeachers: async (email, hashedPassword) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const [result] = await con.execute(
                'INSERT INTO teachers (email, password) VALUES (?, ?)',
                [email, hashedPassword]
            );
            return result.insertId;
        } catch (error) {
            console.error("Erreur lors de l'insertion de l'utilisateur:", error);
            throw error;
        } finally {
            if (con) {
                await db.disconnectFromDatabase(con);
            }
        }
    }
};

export {dbAuth};