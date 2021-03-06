import * as functions from "firebase-functions"
import * as firebaseAdmin from "firebase-admin"
firebaseAdmin.initializeApp(functions.config().firebase)

import * as line from "./shop3cLineWebhook"
import * as session from "./shop3cDialogAgent"
import * as mallFlow from "./flow/mallFlow"
import * as mallService from "./mallService/mallService"
import * as shop3cService from "./mallService/shop3cService"

export const shop3cLineWebhook = line.lineWebhook
export const sessionId = session.sessionId
const bindCustomer = mallFlow.bindCustomer
const unbindCustomer = mallFlow.unbindCustomer
const buy = mallFlow.buy
const banking = mallFlow.banking
const carry = mallFlow.carry

const members = mallService.members
const records = mallService.records

const shop3cCustomer = shop3cService.customers
const product = shop3cService.products

const express = require('express');

const service = express();
const flow = express();

service.all("/shop3c/customers", shop3cCustomer)
service.all("/shop3c/products", product)
service.all("/mall/members", members)
service.all("/mall/records", records)

flow.all("/bindCustomer",bindCustomer)
flow.all("/unbindCustomer",unbindCustomer)
flow.all("/buy",buy)
flow.all("/banking",banking)
flow.all("/carry",carry)

exports.service = functions.https.onRequest(service)
exports.flow = functions.https.onRequest(flow)
