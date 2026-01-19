import {db} from './database.js'

const dbstudents = {
    getAllStudents : async () =>{
        let con;
        try {
            con = await db.connectToDatabase();
            const sqlQuery = `
                SELECT 
                    s.Lastname, s.Firstname, s.Email, s.Phone, 
                    c.Name_year as Classe, p.Name as 'Nom de projet'
                FROM students s
                JOIN Classes c ON s.Classes_id = c.id
                JOIN Projects p ON s.Projects_id = p.id
                ORDER BY s.id`;
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

export {dbstudents};