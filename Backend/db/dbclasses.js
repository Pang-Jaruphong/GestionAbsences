import {db} from './database.js'

const dbclasses = {
    getAllClasses : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `SELECT * FROM classes`
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