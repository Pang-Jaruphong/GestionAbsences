import {db} from './database.js'

const dbabsences = {
    getAllAbsences : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT 
                    a.id, s.Firstname, s.Lastname, a.Status,
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
    updateAbsence: async (absenceId, teacherId, updateData) => {
        let con;
        try {
            con = await db.connectToDatabase();

            // 1. Security: Remove 'JustifiedRuling' if it exists in the payload
            // This ensures the "Justifié" field cannot be modified by this route
            const { Status, Pattern } = updateData;

            // 2. Update with Join-like Verification
            // We only update if the absence belongs to a session assigned to this teacher
            const sqlQuery = `
            UPDATE Absences a
            JOIN Students s ON a.Students_id = s.id
            JOIN Classes_has_Hours chh ON (a.Hours_id = chh.Hours_id AND s.Classes_id = chh.Classes_id)
            SET a.Status = ?, a.Pattern = ?
            WHERE a.id = ? AND chh.Teachers_id = ?
        `;

            const [result] = await con.query(sqlQuery, [Status, Pattern, absenceId, teacherId]);

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: "Modification refusée : Vous n'étiez pas l'enseignant présent ou l'absence n'existe pas."
                };
            }

            return { success: true };

        } catch (error) {
            console.error("SQL Error:", error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    deleteAbsence: async (absenceId, teacherId) => {
        let con;
        try {
            con = await db.connectToDatabase();

            // Verification Query: Does this absence belong to a class/hour session 
            // where the current teacher was assigned?
            const checkQuery = `
            SELECT a.id 
            FROM Absences a
            JOIN Students s ON a.Students_id = s.id
            JOIN Classes_has_Hours chh ON (a.Hours_id = chh.Hours_id AND s.Classes_id = chh.Classes_id)
            WHERE a.id = ? AND chh.Teachers_id = ?
        `;

            const [rows] = await con.query(checkQuery, [absenceId, teacherId]);

            if (rows.length === 0) {
                return { success: false, message: "Non autorisé ou absence introuvable." };
            }

            // Execution Query
            await con.query('DELETE FROM Absences WHERE id = ?', [absenceId]);
            return { success: true };

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}

export {dbabsences};