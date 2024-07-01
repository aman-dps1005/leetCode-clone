import {createClient} from "redis"

const client=createClient();

async function processSubmission(submission:string){
    const {problemId,code,language}=JSON.parse(submission);

    console.log(`the prblem id is ${problemId}`);
    console.log(`the code is : ${code}`);
    console.log(`the language is ${language}`);

    await new Promise(resolve=>setTimeout(resolve,10000));
    console.log(`finished processing for submission of ID:${problemId}`)
}


async function startWorker(){
    try{
        await client.connect();
        console.log("connected to the message queue")
        while(true){
            try{
                const submission=await client.brPop("submission",0);
                //@ts-ignore
                await processSubmission(submission.element);
            }
            catch(err){
                console.log("error while processing the submission");
            }
        }
    }
    catch(err){
        console.log("error while connecting to redis");
    }

}

startWorker();