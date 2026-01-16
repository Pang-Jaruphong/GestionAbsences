import {db} from './database.js'

const dbteachers = {
    getAllTeachers : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `SELECT * FROM teachers`
            const [row] = await con.query(sqlQuery);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    }
}

export {dbteachers};