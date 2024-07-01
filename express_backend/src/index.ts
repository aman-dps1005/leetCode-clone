import express from "express"
import {createClient} from "redis";


const app=express();



const client=createClient({
    url:'redis://localhost:6379'
});

app.use(express.json());

async function startServer(){
    try{
        await client.connect();
        console.log('connected to redis');

        app.listen(3000,()=>{
            console.log("server is listening on port 3000");
        })
    }
    catch(e){
        console.log("error while connecting to redis");
    }
}
startServer();

app.post("/submit",async(req,res)=>{
    const problemId=req.body.problemId;
    const code=req.body.code;
    const language=req.body.language;

    try{
        await client.lPush("submission",JSON.stringify({problemId,code,language}));
        res.status(200).send("submission received successfully");
    }
    catch(err){
        console.log(`redis error:${err}`);
        res.status(500).send("unable to record the submission please try later");
    }
})