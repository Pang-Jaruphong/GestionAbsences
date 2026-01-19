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
    }
}

export {dbabsences};