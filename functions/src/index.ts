import * as functions from "firebase-functions";
import * as express from "express";

const app = express();
app.get("/", (req:any, res:any) => {
    res.status(200).json(
        {
            greeting: "Welcome to Firebase Cloud Functions consuming Daraja APIs",
            message: "Please subscribe",
        }
    );
});

app.get("/test", (req:any, res:any)=> {
    res.status(200).json(
        {
            status: "Up and running",
        }
    );
});

app.get("/get_token", (req:any, res:any)=> {
    const endpoint ="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const ConsumerKey ="BBr75TmAuEwQ0SXA7lduxtIYiu485q5v";
    const ConsumerSecret = "SEqMmwzHtdFOhJhk";

    const auth = Buffer.from(ConsumerKey + ":" + ConsumerSecret).toString("base64");

    req(
        {
            url: endpoint,
            headers: {
                "Authorization": "Basic" + auth,
            },
        },
        function(error: any, response:any, body:any) {
            if (error) {
                console.log(error);
                res.status(401).json({message: error});
            }
            res.status(200).json(body);
        }
    );
});

function _AccessToken(req:any, res:any, next:any) {
    const endpoint ="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const ConsumerKey ="BBr75TmAuEwQ0SXA7lduxtIYiu485q5v";
    const ConsumerSecret = "SEqMmwzHtdFOhJhk";

    const auth = Buffer.from(ConsumerKey + ":" + ConsumerSecret).toString("base64");

    req(
        {
            url: endpoint,
            headers: {
                "Authorization": "Basic" + auth,
            },
        },
        function(error: any, response:any, body:any) {
            if (error) {
                console.log(error);
                res.status(401).json({message: error});
            }
            req._AccessToken = (JSON.parse(body)).access_token;
            next();
        }
    );
}

app.get("/token", _AccessToken, (req:any, res:any) => {
    res.status(200).json({message: req.access_token});
});

app.get("/reqister", _AccessToken, (req:any, res:any) => {
    const endpoint = "";

    req({
        method: "POST",
        url: endpoint,
        headers: {
            "Authorization": "Bearer" + req.access_token,
        },
        json: {
            "ShortCode": "600000",
            "ResponseType": "Completed",
            "ConfirmationURL": "https://us-central1-mpesaflutter.cloudfunctions.net/main/c2b/confirm",
            "ValidationURL": "https://us-central1-mpesaflutter.cloudfunctions.net/main/c2b/validate",
        },
    },
    function(error: any, response: any, body: any) {
        if (error) {
            console.log(error);
        }
        res.status(200).json(body);
    },
    );
});

app.post("/c2b/confirm", (req:any, res:any) => {
    console.log(req.body);
    res.status(200).json(
        {
            "ResultsCode": 0,
            "ResultDesc": "success",
        }
    );
});

app.post("/c2b/validate", (req:any, res:any) => {
    console.log(req.body);
    res.status(200).json(
        {
            "ResultCode": 0,
            "ResultDesc": "success",
        }
    );
});

app.get("/simulate", _AccessToken, (req:any, res:any)=> {
    const endpoint = "";

    req(
        {
            url: endpoint,
            method: "POST",
            headers: {
                "Authorization": "Bearer" + req.access_token,
            },
            json: {
                "ShortCode": "600000",
                "Amount": 1,
                "BillRefNumber": "TestPay",
                "Msisdn": "254740096425",
                "CommandID": "CustomerPayBillOnline",
            },
        },
        function(error: any, response: any, body: any) {
            if (error) {
                console.log(error);
                res.json({message: "An error occurred"});
            }
            res.status(200).json(body);
        }
    );
});
export const main = functions.https.onRequest(app);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onrequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
