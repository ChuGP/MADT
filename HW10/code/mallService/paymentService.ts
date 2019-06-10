import * as functions from 'firebase-functions'
import * as firebaseAdmin from "firebase-admin"
import * as cors from 'cors'
import { Customer, Record } from './mallServiceModel'

const database = firebaseAdmin.firestore()
const corsHandler = cors({ origin: true })
const customerCollection = database.collection("PaymentCustomer")

export const customers = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        switch (req.method) {
            case "POST":
                createCustomer(req, res)
                break
            case "GET":
                getCustomer(req, res)
                break
            case "PUT":
                updateCustomer(req, res)
                break
            case "DELETE":
                deleteCustomer(req, res)
                break
            default:
                break
        }
    })
})

const createCustomer = (req, res) => {
    const customer = req.body.customer
    customerCollection.doc(customer.memberId).create(customer)
    res.status(200).send("OK")
}

const getCustomer = async (req, res) => {
    const queryKey = req.query.key
    const queryValue = req.query.value
    if (queryKey) {
        let customers = []
        let firestoreQuery = customerCollection as FirebaseFirestore.Query
        if (!Array.isArray(queryKey)) {
            firestoreQuery = firestoreQuery.where(queryKey, "==", queryValue)
        }
        else {
            for (const key in queryKey)
                firestoreQuery = firestoreQuery.where(queryKey[key], "==", queryValue[key])
        }
        await firestoreQuery.get().then(snapshot => {
            if (snapshot.docs.length > 0) {
                for (const firestoreDoc of snapshot.docs)
                    customers.push(firestoreDoc.data() as Customer)
            }
        })
        res.status(200).send({ customers })
    }
    else {
        let customers = []
        await customerCollection.get().then(snapshot => {
            for (const firestoreDoc of snapshot.docs)
                customers.push(firestoreDoc.data() as Customer)
        })
        res.status(200).send({ customers })
    }
}

const updateCustomer = (req, res) => {
    const customer = req.body.customer
    customerCollection.doc(customer.memberId).set(customer, { merge: true })
    res.status(200).send("OK")
}

const deleteCustomer = (req, res) => {
    const memberId = req.query.memberId
    customerCollection.doc(memberId).delete()
    res.status(200).send("OK")
}