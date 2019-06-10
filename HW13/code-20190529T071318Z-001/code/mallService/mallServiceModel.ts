export type Member = {
    memberId: string
    name: string
    phone: string
}

export type Customer = {
    memberId: string
    lineId: string
    weChatId: string
    stratoId: string
    token?:string
    account?: {
        balance: number
    }
    address?: {
        home: string
        office: string
    }
}

export type Product = {
    id: string
    name: string
    price: number
}

export type Record = {
    id: string
    transactionId: string
    shopId: string
    customerId: string
    action: string
    amount: number
    error: string
    timestamp: number
}