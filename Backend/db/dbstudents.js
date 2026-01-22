import {db} from './database.js'

const dbstudents = {
    getAllStudents : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT 
                    s.Lastname, s.Firstname, s.Email, s.Phone, 
                    c.Name_year as Classe, p.Name as 'Nom de projet'
                FROM students s
                JOIN Classes c ON s.Classes_id = c.id
                JOIN Projects p ON s.Projects_id = p.id
                ORDER BY s.id`;
            const [rows] = await con.query(sqlQuery);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
// Ajouter 'classId' comme argument de la fonction
    // Aider par Gemini Le résultat n'affiche pas correctement
    getAllStudentsByClasses : async (classId) =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT 
                    c.Name_year as 'Classe', c.Salle,
                    t.Acronyme as 'Maître de classe',
                    s.Firstname as 'Prénom',
                    s.Lastname as 'Nom de famille',
                    p.Name as 'Nom de projets'
                FROM students s
                JOIN classes c ON s.Classes_id = c.id
                JOIN teachers t ON c.Teachers_id = t.id 
                JOIN projects p ON s.Projects_id = p.id
                WHERE s.Classes_id = ?`
            const [rows] = await con.query(sqlQuery, [classId]);
            return rows;
        } catch (error) {
            console.error("Erreur SQL détaillée :",error.message);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}

export {dbstudents};