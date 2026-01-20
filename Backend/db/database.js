import mysql from 'mysql2/promise'
import 'dotenv/config'
// importer mysql2 pour pouvoir faire la connexion à la database

// On entre les coordonnées du compte SQL avec la base de donnée exécutée afin que le code puisse récupérer les données
// sync => attend que la fonction soit finie pour passer a la suivante
// async => passe a la suite meme si la fonction n est pas terminée
// await => termine de traiter d'autres taches pendant qu il attend le resultat
const db = {
    connectToDatabase: async () => {
        const con = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        return con;
    },
    disconnectFromDatabase: async (con) => {
        try {
            await con.end();
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
        }
    },
}

export {db}