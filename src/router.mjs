import express from "express"
import storage from "./storage.mjs";

let ledOn = false;

const app = express();

app.use(express.static("src/client"));

app.use( (req,res,next) => {
    console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    next();
});

app.get("", (req,res) => {
    // console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    res.send("Welcome");
});
app.get("/get-ledstate", (req,res) => {
    // console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    res.send(ledOn ? "1" : "0");
})
app.get("/set-ledstate", (req,res) => {
    // console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    const state = req.query.state;
    ledOn = state == "1" ? true : false;
    // res.send(ledOn ? "1" : "0");
    res.send(ledOn);
})
let sensorDataIndex = 0;
const sensorData = [{temp:23.0, hum:40},{temp:25.0, hum:30},{temp:30.0, hum:50},{temp:28.0, hum:28}];
app.get("/get-data", async (req,res) => {
    // console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    // const data = {temp:0.0,hum:0.0};

    let data = await storage.getData();
    console.log(data);
    // if (data == undefined) data = {};
    // const data = sensorData[sensorDataIndex++];
    // if (sensorDataIndex >= sensorData.length) sensorDataIndex = 0;
    res.json(data);
});
app.get("/post-data", (req,res) => {
    let temp, hum = undefined;
    if (req.query.temp == 0 || req.query.temp != undefined) {
        temp = req.query.temp;
    }
    if (req.query.hum == 0 || req.query.hum != undefined) {
        hum = req.query.hum;
    }
    if (temp != undefined && hum != undefined) {
        console.log(`temp:${temp}, hum:${hum}`);
        storage.addData(temp, hum);
    }else {
        console.log("temp and hum undefined");
    }
    res.send("ok");
})
app.get("*", (req,res) => {
    // console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    res.send("Resource not found");
})



export default app;