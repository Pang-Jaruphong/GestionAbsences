import {db} from "./database.js";

const dbprojectHasTeachers = {
    getAllTeachers: async (id) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `SELECT * FROM teachers`;
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

export {dbprojectHasTeachers};