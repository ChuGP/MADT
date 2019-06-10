export const DIALOGFLOW = {
    path: "PaaS-hw1-21-f0789b7eb3aa.json",
    projectId: "paas-hw1-21-232110",
    languageCode: 'zh-TW'
}

export const ASSISTANT = {
    username: "apikey",
    password: "URAWWPniMLDUTDeyBSvyhEFaa6vcdU15gmJsvV8SFsx_",
    url: "https://gateway.watsonplatform.net/assistant/api/v2/assistants/75f77424-9eb2-453e-b7e3-e52a897b6aa6/sessions",
    version: "2018-11-08",
    assistantId: "75f77424-9eb2-453e-b7e3-e52a897b6aa6"
}

export const pubsubConfig = {
    serviceAccountPath: "./serviceAccountKey_pub_sub.json",
    topicPath: "projects/paas-hw1-22-232110/topics/",   
    subPath: "projects/paas-hw1-22-232110/subscriptions/",  
}

export const shops=
{
    payment:{
        id:"12",
        shopId: "payment",
        name: "鄉民寶支付",
        line: {
            channelId: "1557840648",
            channelSecret: "f4e385c61f1f43218c8d2b098711ba66",
        }
    },
    codeShop:{
        id:"11",
        shopId: "insurance",
        name: "幽默學程式",
        line: {            
            channelId: "1649585264",
            channelSecret: "048a4f61325bff73a182473a99d29adf",
        }
    },
    carrier:{
        id:"13",
        shopId: "carrier",
        name: "bug carrier",
        line: {
            channelId: "1649586736",
            channelSecret: "d302bfd9616f975ca87c8aa921640a8b",
        }
    }
}

export const APIGEE = {
    url:"https://a5824384-eval-test.apigee.net/",
    apikey:"4woc1nUGpUAmxfkGRYENRYhmpkXJeAIj"
}

// export const APIGEE = {
//     url:"https://paastaipeitech-eval-2019apps.apigee.io/",
//     apikey:"123321"
// }

export const topicName = "topicForChat"
export const paymentSub="payment"
export const codeShopSub="codeShop"
export const cloud="https://us-central1-paas-hw1-21-232110.cloudfunctions.net/"
export const local="http://816bb2e4.ngrok.io/paas-hw1-22-232110/us-central1/"
export const url=cloud