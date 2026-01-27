import {db} from "./database.js";

const dbProjectsTeachers = {
    getAllProjectsTeachers : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT  p.Name, p.Name_groupe,
                        t.Acronyme, t.Lastname
                FROM projects_has_teachers pht
                JOIN Projects p ON pht.Projects_id = p.id
                JOIN Teachers t ON pht.Teachers_id = t.id`
            const [rows] = await con.query(sqlQuery);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
    getAllProjectsById : async(projectsId) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT p.Name As "Nom de projet", p.Name_groupe,
                t.Acronyme,
                s.Firstname, s.Lastname
                FROM Projects p
                JOIN Projects_has_Teachers pht ON pht.Projects_id = p.id
                JOIN Teachers t ON pht.Projects_id = t.id
                JOIN Students s ON p.id = s.Projects_id
                WHERE p.id = ?`
            const [rows] = await con.query(sqlQuery, [projectsId]);
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
 */

export {dbProjectsTeachers};