import { nanoid } from "nanoid";
import { db } from "../Database/database.connection.js";

export async function shortenUrls(req,res){
    const {url} = req.body
    let session= res.locals.session
    console.log(session)
    try{
        const short =  nanoid()
        await db.query(`INSERT INTO urls ("shortUrl",url, user) VALUES  ($1,$2, $3);`,[short,url, session.rows[0].email])
        let resposta= await db.query(`SELECT * FROM urls WHERE url= $1;`,[url])
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
        let linkU = await db.query(`SELECT * FROM urls WHERE id= $1;`, [id])
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

export async function deleteUrl(req,res){
    const {id} = parseInt(req.params)
    const session= res.locals.session

    try{
        let existing= await db.query(`SELECT * FROM urls WHERE id= $1;`,[id])
        if( existing.rows.length ===0){
            return res.sendStatus(404)
        }
        else{
            if (existing.rows[0].user !== session.rows[0].email){
                return res.sendStatus(401)
            }
            await db.query(`DELETE * FROM urls WHERE id=$1;`,[id])
            return res.sendStatus(204)
        }
    }catch(err){
        console.log(err.message)
    }
}

export async function redirectUrl(req,res){
    const {shortUrl}= req.params
    try{
        let existing= await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1;`,[shortUrl])
        if( existing.rows.length === 0){
            return res.sendStatus(404)
        }
        else{
            let link= existing.rows[0].url
            let count= existing.rows[0].visitCount + 1
            await db.query(`UPDATE urls SET "visitCount"= $1 WHERE "shortUrl"=$2;`, [count, shortUrl])
            return res.redirect(link)
        }
    } catch(err){
        console.log(err.message)
    }
}