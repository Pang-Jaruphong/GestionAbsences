import {db} from './database.js'

const dbclasses = {
    getAllClasses : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT 
                    c.Name_year as 'La classe', c.Salle,
                    t.Acronyme as Prof
                FROM classes c
                JOIN teachers t ON c.teachers_id = t.id`
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

export {dbclasses};