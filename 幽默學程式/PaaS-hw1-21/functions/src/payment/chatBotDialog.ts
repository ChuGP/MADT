import * as functions from "firebase-functions"
import * as paymentService from "./paymentService"
import axios from "axios"

import { insuranceServiceUrl, sessionServiceUrl } from "./paymentConfig"
import { DialogMessage } from "../dialogMessage"
import { dialogAgent } from "./dialogAgent"

export const messageDispatcher = (dialogMessage: DialogMessage|any): void => {
    const request = {
        input: {
            text: dialogMessage.userMessage.intent,
            options: {
                return_context: true
            }
        }
    }
    dialogMessage.agent = "ibmAssistant"
    dialogAgent(request, dialogMessage).then(response => {
        if (response.output.actions)
            actionDispatcher(response, dialogMessage)
    })
}

const actionDispatcher = (response:any, dialogMessage: DialogMessage): void => {
    let balance
    let minBalance
    let totalBalance
    let result_variable = {} as any
    switch (response.output.actions[0].name) {
        case "balance":
            balance = paymentService.getBalance()
            minBalance = paymentService.getMininumBalance()
            result_variable.result = {
                balance: balance,
                minBalance: minBalance
            }
            break
        case "deposit":
            balance = paymentService.getBalance()
            minBalance = paymentService.getMininumBalance()
            const amount = response.output.actions[0].parameters.amount
            totalBalance = balance + amount
            paymentService.updateBalance(totalBalance)
            result_variable.result = {
                balance: balance,
                minBalance: minBalance,
                amount: amount,
                totalBalance: totalBalance
            }
            break
        case "pay":
            balance = paymentService.getBalance()
            const price = response.output.actions[0].parameters.price
            totalBalance = balance - price
            paymentService.updateBalance(totalBalance)
            result_variable.result = {
                balance: balance,
                price: price,
                totalBalance: totalBalance
            }
            axios.delete(sessionServiceUrl + "sessionId" + `?userId=${dialogMessage.userId}`)
            break
        case "handOver":
            const shop = response.output.actions[0].parameters.shop
            if (shop == "保險商店") {
                axios.post(insuranceServiceUrl + "handOverToShop", {
                    shopMessage: {
                        channel: dialogMessage.channel,
                        userId: dialogMessage.userId,
                        event: "welcome"
                    }
                })
            }
            break
    }
    if (Object.keys(result_variable).length > 0) {
        const request = {
            context: {
                skills: {
                    "main skill": {
                        user_defined: result_variable
                    }
                }
            }
        }
        dialogMessage.agent = "ibmAssistant"
        dialogAgent(request, dialogMessage).then(response => {
            if (response.output.actions)
                actionDispatcher(response, dialogMessage)
        })
    }
}

export const handOverToPayment = functions.https.onRequest((req, res) => {
    const shopMessage = req.body.shopMessage
    let result_variable = {} as any
    const dialogMessage: DialogMessage = {
        channel: shopMessage.channel,
        userId: shopMessage.userId
    }
    result_variable.product = shopMessage.product
    result_variable.event = shopMessage.event

    const request = {
        context: {
            skills: {
                "main skill": {
                    user_defined: result_variable
                }
            }
        }
    }
    dialogMessage.agent = "ibmAssistant"
    dialogAgent(request, dialogMessage).then(response => {
        if (response.output.actions)
            actionDispatcher(response, dialogMessage)
    })
    res.sendStatus(200)
})

