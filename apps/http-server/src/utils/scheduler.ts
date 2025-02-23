import {prisma} from "../config";
import cron from "node-cron";
import { TwitterApi } from 'twitter-api-v2';

cron.schedule('* * * * *', async () => {
    console.log("schedular started")
    
    const dueTweets = await prisma.post.findMany({
        where:{
            status:"SCHEDULED",
            scheduledFor:{lte: new Date()}
        }
    })

    dueTweets.map(async (tweet) => {

        const twitterAccount = await prisma.twitter.findUnique({
            where: {
                userId:tweet.userId
            }
        })

        if(!twitterAccount) {
        console.error(`Twitter account not linked for user ${tweet.userId}`);
        return;
        }

         const client = new TwitterApi({
                    appKey: process.env.TWITTER_CLIENT_ID as string,
                    appSecret: process.env.TWITTER_CLIENT_SECRET as string,
                    accessToken:twitterAccount.accessToken,
                    accessSecret:twitterAccount.refreshToken
                  })
        

        try {
            console.log("reached here")
            const response = await client.v2.tweet(tweet.postContent);
            //resolve create or update post
            const respo = await prisma.post.update({
                where:{
                        id:tweet.id
                },
                data:{

                    status:"PUBLISHED",
                    tweetId:response.data.id
                }
            })
            console.log("Published Tweet",respo.id);

           

        }catch(err) {
            console.log(err);
            return;

        }



    })
})