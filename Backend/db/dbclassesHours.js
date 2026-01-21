import {db} from './database.js'

/*
const dbclassesHours = {
    getAllClassesHours : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `SELECT * FROM classes_has_hours`
            const [rows] = await con.query(sqlQuery);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}
*/

// aide par Gemini
const dbclassesHours = {
    getAllClassesHours : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT 
                    c.Name_year AS Class, c.Salle, t.acronyme AS Enseignant,
                    h.date, h.period
                FROM classes_has_hours chh
                JOIN classes c ON chh.Classes_id = c.id
                JOIN hours h ON chh.Hours_id = h.id
                JOIN teachers t ON c.Teachers_id = t.id
                WHERE chh.Is_active = 1
                ORDER BY c.id`;
            const [rows] = await con.query(sqlQuery);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}
export {dbclassesHours};