import { db } from "../Database/database.connection.js";

export async function getUser(req,res){
    let session= res.locals.session
    let visits=0;
    try{
        let user = await db.query(`SELECT * FROM users WHERE email= $1;`,[session.rows[0].email])
        let shortened= await db.query(`SELECT * FROM urls WHERE "user"= $1;`,[user.rows[0].id])
        for (let i=0; i <  shortened.rows.length; i++){
            visits= visits + shortened.rows[i].visitCount
        }
        const body = {
            id: user.rows[0].id,
            name: user.rows[0].name,
            visitCount: visits,
            shortenedUrls: shortened.rows
        }
        return res.status(200).send(body)
    } catch(err){
        console.log(err.message) 
    }
}

export async function getRanking(req,res){
    let ranking=[]
    try{
        let users= await db.query(`SELECT * FROM users;`)
        for (let i=0; i < users.rows.length; i++){
            let linkCount = await db.query(`SELECT COUNT(urls."shortUrl") AS "linkCount" FROM urls WHERE "user"= $1;`, [users.rows[i].id])
            let visitSum= await db.query (`SELECT SUM(urls."visitCount") AS "visitSum" from urls WHERE "user"=$1;`,[users.rows[i].id])
            console.log(linkCount)
            console.log(visitSum)
            ranking.push(
                {id: users.rows[i].id,
                 name: users.rows[i].name,
                 linksCount: linkCount.rows[0].linkCount,
                 visitCount: visitSum.rows[0].visitSum}
            )
        }
    } catch(err){
        console.log(err.message)
    }
    for(let i=0; i< ranking.length; i++){
        
        let maior =i;
        let item1 = ranking[i].visitCount
        for(let j= i + 1; j<ranking.length;j++){
            let item2= ranking[j].visitCount
          if(item2>item1){
            maior = j;
          }
        }
        let aux= ranking[i];
        ranking[i]=ranking[maior];
        ranking[maior]=aux;
      }
    if (ranking.length <= 10){
        return res.status(200).send(ranking)
    }
    else{
        let limitedRanking=[]
        for (let i=0; i < 10; i++){
            limitedRanking.push(ranking[i])
        }
        return res.status(200).send(limitedRanking)
    }
}