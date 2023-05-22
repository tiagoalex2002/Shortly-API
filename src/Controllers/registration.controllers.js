import { db } from "../Database/database.connection.js"
import { v4 as uuid} from "uuid";
import bcrypt from "bcrypt";


export async function signUp(req,res){

    const {name, email, password, confirmPassword} = req.body;

    if(password !== confirmPassword){
        return res.sendStatus(422)
    }
    else{
        const encryptedPassword = bcrypt.hashSync(password, 10);
        try{
            let user= await db.query(`SELECT * FROM users WHERE email= $1;`, [email])
            if(user.rows.length !== 0){
                return res.sendStatus(409)
            }
            else{
                await db.query(`INSERT INTO users (name, email, password) VALUES
                ($1, $2, $3);
                `, [name, email,encryptedPassword])
                return res.sendStatus(201)
            }
        } catch(err){
            console.log(err.message)
        }
    }
}

export async function signIn(req,res){
    const {email, password}= req.body;
    const token= uuid()
    try{
        let user= await db.query(`SELECT * FROM users WHERE email= $1;`, [email])
        if(user.rows.length === 0 ||  !bcrypt.compareSync(password, user.rows[0].password)){
            return res.sendStatus(401)
        }
        else{
            await db.query(`INSERT INTO logged (email, token) VALUES
            ($1, $2);`, [email, token])
            return res.status(200).send({token: token})
        }
    } catch(err){
        console.log(err.message)
    }
}