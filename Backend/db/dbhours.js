import {db} from './database.js'

const dbhours = {
    getAllHours : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `SELECT * FROM hours`
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

export {dbhours};