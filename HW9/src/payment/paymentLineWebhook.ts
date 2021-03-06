

import * as functions from 'firebase-functions'

import { WebhookEvent, validateSignature } from "@line/bot-sdk"
import { shop } from "./paymentConfig"
import * as chatBotDialog from "./paymentChatBot"
import { DialogMessage } from "./paymentModel"


export const lineWebhook = functions.https.onRequest((req, res) => {
    const signature = req.headers["x-line-signature"] as string
    if (validateSignature(JSON.stringify(req.body), shop.line.channelSecret, signature)) {
        const events = req.body.events as Array<WebhookEvent>
        for (const event of events)
            eventDispatcher(event)
        res.sendStatus(200)
    } else {
        res.status(403)
    }
})

const eventDispatcher = (event: WebhookEvent): void => {
    let userId
    const timestamp = event.timestamp
    userId = event.source.userId
    console.log(userId)
    let dialogMessage
    switch (event.type) {
        case "follow":
            dialogMessage = {
                channel: "Line",
                chatId: userId,
                userMessage: {
                    type: "event",
                    event: "follow"
                },
                timestamp: timestamp
            } as DialogMessage
            chatBotDialog.messageDispatcher(dialogMessage)
            break
        case "unfollow":
            dialogMessage = {
                channel: "Line",
                chatId: userId,
                userMessage: {
                    type: "event",
                    event: "unfollow"
                },
                timestamp: timestamp
            } as DialogMessage
            chatBotDialog.messageDispatcher(dialogMessage)
            break
        case "message":
            if (event.message.type == "text") {
                dialogMessage = {
                    channel: "Line",
                    chatId: userId,
                    userMessage: {
                        type: "text",
                        intent: event.message.text
                    },
                    replyMessages: {},
                    timestamp: timestamp
                } as DialogMessage
                chatBotDialog.messageDispatcher(dialogMessage)
            }
            break
    }
}
