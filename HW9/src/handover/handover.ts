import * as functions from 'firebase-functions'
import * as cors from 'cors'
import * as PubSub from "@google-cloud/pubsub"

import { pubsubConfig, shopTopicName } from "./handoverConfig"

const googlePubsub = PubSub({ keyFilename: pubsubConfig.serviceAccountPath })
const corsHandler = cors({ origin: true });

export const shopHandover = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        const handoverModel = req.body.handoverModel
        const dataBuffer = Buffer.from(JSON.stringify(handoverModel));
        await googlePubsub.topic(pubsubConfig.topicPath + shopTopicName).publisher().publish(dataBuffer).then(res => {
        }).catch(err => {
            console.log(err)
        })
        res.sendStatus(200)
    })
})