import { db } from "../Database/database.connection.js";
export async function authValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send("O erro é na autenticação com o token")
    }

    try {
        const session = await db.query(`SELECT * FROM logged WHERE token= $1;`,[token])
        if (session.rows.length === 0) return res.status(401).send("O erro é aqui");
        res.locals.session= session;
        next();
    } catch (err) {
        console.log(err.message)
    }
}