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
                    GROUP_CONCAT(CONCAT(s.Firstname, ' ', s.Lastname) SEPARATOR ', ') AS étudients
                FROM Projects p
                JOIN Projects_has_Teachers pht ON pht.Projects_id = p.id
                JOIN Teachers t ON pht.Projects_id = t.id
                JOIN Students s ON p.id = s.Projects_id
                WHERE p.id = ?
                GROUP BY p.id, t.id`
            const [rows] = await con.query(sqlQuery, [projectsId]);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (con) await db.disconnectFromDatabase(con);
        }
    },
// aider par Gemini pour corriger des syntaxes
    getProjectsAbsencesById : async(projectsId) => {
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT p.Name As "Nom de projet",
                       p.Name_groupe,
                       t.Acronyme,
                       COUNT(DISTINCT a.id) AS "Total absences",
                        IFNULL(
                               GROUP_CONCAT(
                                       DISTINCT CONCAT(s.Firstname, ' ', s.Lastname, ' : ',
                                                     a.Status, ' (',a.Pattern, ')') SEPARATOR ' | '), 'Aucune absences') AS Détails
                FROM Projects p
                JOIN Projects_has_Teachers pht ON pht.Projects_id = p.id
                JOIN Teachers t ON pht.Projects_id = t.id
                JOIN Students s ON p.id = s.Projects_id
                JOIN Absences a ON s.id = a.students_id
                WHERE p.id = ?`;
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