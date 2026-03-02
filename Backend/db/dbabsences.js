import {db} from './database.js'

const dbabsences = {
    getAllAbsences : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT 
                    s.Firstname, s.Lastname, a.Status,
                    CASE WHEN a.JustifiedRuling = 1 THEN 'Oui' ELSE 'Non' END AS Justificatif,
                    a.pattern AS Raison, h.Date, h.Begin, h.End, h.Period
                FROM absences a
                JOIN students s ON a.Students_id = s.id
                JOIN hours h ON a.Students_id = h.id
                ORDER BY h.id`;
            const [rows] = await con.query(sqlQuery);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    getAbsencesById : async (studentsId) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT s.Firstname,
                       s.Lastname,
                       a.Status,
                       CASE WHEN a.JustifiedRuling = 1 THEN 'Oui' ELSE 'Non' END AS Justificatif,
                       a.pattern                                                 AS Raison,
                       h.Date,
                       h.Begin,
                       h.End,
                       h.Period
                FROM absences a
                JOIN students s ON a.Students_id = s.id
                JOIN hours h ON a.Hours_id = h.id
                WHERE a.students_id = ?`;
            const [rows] = await con.query(sqlQuery, [studentsId]);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    getAbsencesByClasses : async (classeId) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT s.Firstname,
                       s.Lastname,
                       c.Name_year AS "Nom de la classe",
                       a.Status,
                       CASE WHEN a.JustifiedRuling = 1 THEN 'Oui' ELSE 'Non' END AS Justificatif,
                       a.pattern                                                 AS Raison,
                       h.Date,
                       h.Begin,
                       h.End,
                       h.Period
                FROM absences a
                JOIN students s ON a.Students_id = s.id
                JOIN hours h ON a.Hours_id = h.id
                JOIN classes c ON s.Classes_id = c.id
                WHERE s.Classes_id = ?`;
            const [rows] = await con.query(sqlQuery, [classeId]);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    createAbsences : async (Hours_id, Students_id) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                INSERT INTO absences (Status, JustifiedRuling, Pattern, Hours_id, Students_id)
                VALUES (?, ?, ?, ?, ?)`;
            const values = ['Absent', 0, "Non spécifié", Hours_id, Students_id];
            const [rows] = await con.query(sqlQuery, values);
            return rows.insertId;
        } catch (error) {
            console.error("Erreur BDD lors de la création d'un client");

            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
};

export {dbabsences};