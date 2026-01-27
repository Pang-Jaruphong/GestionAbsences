import {db} from "./database.js";

const dbProjectsTeachers = {
    getAllProjectsTeachers : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `SELECT * FROM projects_has_teachers`
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
/*
const dbprojectHasTeachers = {
    getAllTeachers: async (id) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `SELECT * FROM projects_has_teachers`;
            const [rows] = await Promise.all([]);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await dbprojectHasTeachers.delete(id);
        }
    }
}
 */

export {dbProjectsTeachers};