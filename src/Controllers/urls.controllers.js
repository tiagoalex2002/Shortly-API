import { nanoid } from "nanoid/async";
import { db } from "../Database/database.connection.js";

export async function shortenUrls(req,res){
    const {url} = req.body
    let session= res.locals.session
    try{
        const short = await nanoid()
        await db.query(`INSERT INTO urls ("shortUrl",url, user) VALUES  ($1,$2)`,[short,url, session.rows[0].email])
        let resposta= await db.query(`SELECT * FROM urls WHERE url= $1`,[url])
        return res.status(201).send({
            id: resposta.rows[0].id,
            shortUrl: resposta.rows[0].shortUrl
        })
    }catch(err){
        console.log(err.message)
    }

}

export async function getUrlbyId(req,res) {
    const {id}= parseInt(req.params)
    try{
        let linkU = await db.query(`SELECT * FROM urls WHERE id= $1`, [id])
        if(linkU.rows.length ===0){
            return res.sendStatus(404)
        }
        else{
            return res.status(200).send({
                id: linkU.rows[0].id,
                shortUrl: linkU.rows[0].shortUrl,
                url: linkU.rows[0].url
            })
        }
    } catch(err){
        console.log(err.message)
    }
}

