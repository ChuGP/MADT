import * as functions from 'firebase-functions'
import * as firebaseAdmin from 'firebase-admin'
import * as cors from 'cors'
import { Customer, Product} from './mallServiceModel'

const database = firebaseAdmin.firestore()
const corsHandler = cors({ origin: true })
const customerCollection = database.collection("InsuranceCustomer")
const productCollection = database.collection("Product")

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

const createCustomer = (req:any, res:any) => {
    const customer = req.body.customer as Customer
    customerCollection.doc(customer.memberId).create(customer)
    res.status(200).send("OK")
}

const getCustomer = async (req:any, res:any) => {
    const queryKey = req.query.queryKey
    const queryValue = req.query.queryValue
    if (queryKey) {
        let customers:any = []
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
        let customers:any = []
        await customerCollection.get().then(snapshot => {
            for (const firestoreDoc of snapshot.docs)
                customers.push(firestoreDoc.data() as Customer)
        })
        res.status(200).send({ customers })
    }
}

const updateCustomer = (req:any, res:any) => {
    const customer = req.body.customer
    customerCollection.doc(customer.memberId).set(customer, { merge: true })
    res.status(200).send("OK")
}

const deleteCustomer = (req:any, res:any) => {
    const memberId = req.query.memberId
    customerCollection.doc(memberId).delete()
    res.status(200).send("OK")
}

export const products = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        switch (req.method) {
            case "POST":
                createProduct(req, res)
                break
            case "GET":
                getProduct(req, res)
                break
            case "PUT":
                updateProduct(req, res)
                break
            case "DELETE":
                deleteProduct(req, res)
                break
            default:
                break
        }
    })
})

const createProduct = async (req:any, res:any) => {
    const product = req.body.product
    const productId = productCollection.doc().id
    product.id = productId
    await productCollection.doc(productId).set(product)
    res.status(200).send("OK")
}

const getProduct = async (req:any, res:any) => {
    const queryKey = req.query.key
    const queryValue = req.query.value
    if (queryKey) {
        let products:any= []
        let firestoreQuery = productCollection as FirebaseFirestore.Query
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
                    products.push(firestoreDoc.data() as Product)
            }
        })
        res.status(200).send({ products })
    }
    else {
        let products:any = []
        await productCollection.get().then(snapshot => {
            for (const firestoreDoc of snapshot.docs)
                products.push(firestoreDoc.data() as Product)
        })
        res.status(200).send({ products })
    }
}

const updateProduct = (req:any, res:any) => {
    const product = req.body.product
    productCollection.doc(product.id).set(product, { merge: true })
    res.status(200).send("OK")
}

const deleteProduct = (req:any, res:any) => {
    const productId = req.query.productId
    productCollection.doc(productId).delete()
    res.status(200).send("OK")
}