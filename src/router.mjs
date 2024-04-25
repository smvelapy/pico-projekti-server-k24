import express from "express"
import storage from "./storage.mjs";

import {appstate} from "./settings.mjs";
// let ledOn = false;¨
import { debugSettings,TEMP_OVERWRITE_STATE_NONE,TEMP_OVERWRITE_STATE_LOW_TEMP,TEMP_OVERWRITE_STATE_HIGH_TEMP } from "./debug.mjs";

const app = express();

app.use(express.static("src/client"));
app.use(express.json());

app.use( (req,res,next) => {
    console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    next();
});

app.get("/", (req,res) => {
    // console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    res.send("Welcome");
});
app.get("/ledstate-get", (req,res) => {
    // console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    res.send(""+appstate.getMcustate().ledState);
})
app.get("/ledstate-put", (req,res) => {
    // console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    const state = req.query.state;
    appstate.updateLedstate(state == "1" ? 1 : 0)
    // res.send(ledOn ? "1" : "0");
    res.send("ok");
})
app.get("/settings-get", (req,res) => {
    // console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    // const set = {
    //     led_state: settings.ledState ? 1 : 0
    // }
    if (req.query.hasOwnProperty("sensor-mode")) {
        const sensorModeRaw = req.query["sensor-mode"]
        if (!isNaN(sensorModeRaw)) {
            appstate.sensorMode = parseInt(sensorModeRaw);
        }
        // const 
        // console.log("Hastype: "+req.query["sensor-mode"]);
    }else {
        console.log("no")
    }
    res.json(appstate.mcustate);
    // res.send(settings.ledOn ? "1" : "0");
})
app.get("/appstate-get", (req,res) => {
    // console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    // const set = {
    //     led_state: settings.ledState ? 1 : 0
    // }
    res.json(appstate.getAppstate());
    // res.send(settings.ledOn ? "1" : "0");
})
app.get("/test/temp-overwrite-state-put", (req,res) => {
    parseInt()
    if (req.query.state == 0 || req.query.state != undefined) {
        let state = parseInt(req.query.state);
        debugSettings.tempOverwriteState = state;
        console.log("tempOverwriteState: "+state);
    }
    res.send("ok");
});

app.get("/data-get", async (req,res) => {
    let data = await storage.getData();
    console.log(data);
    res.json(data);
});
app.get("/data-post", (req,res) => {
    let temp, hum = undefined;
    let sensorType = undefined;

    if (req.query.hasOwnProperty("temp")) {
        // console.log("temp exists, isNan: "+isNaN(req.query.temp));
        if (!isNaN(req.query.temp)) {
            temp = parseFloat(req.query.temp);
        }
    }
    if (req.query.hasOwnProperty("hum")) {
        // console.log("hum exists, isNan: "+isNaN(req.query.hum));
        if (!isNaN(req.query.hum)) {
            hum = parseFloat(req.query.hum);
        }
    }
    if (req.query.hasOwnProperty("sensor_type")) {
        if (!isNaN(req.query.sensor_type)) {
            // console.log("req.query.sensor_type: "+req.query.sensor_type);
            appstate.sensorReaded = parseInt(req.query.sensor_type);
            // console.log("sensorReaded: "+appstate.sensorReaded);
        }
    }
    if (temp != undefined && hum != undefined) {
        switch (debugSettings.tempOverwriteState) {
            case TEMP_OVERWRITE_STATE_HIGH_TEMP:
                temp += 20;
                break;
            case TEMP_OVERWRITE_STATE_LOW_TEMP:
                temp -= 10;
                break;
        }

        // console.log(`temp:${temp}, hum:${hum}`);
        storage.addData(temp, hum);
        appstate.temp = temp;
        appstate.hum = hum;
    }else {
        // console.log("temp and hum undefined");
    }
    res.send("ok");
})
app.get("/dataall-get", async (req,res) => {
    let data = await storage.getAllData();
    console.log(data);
    res.json(data);
});

app.get("/reset", (req,res) => {
    storage.deleteAllData();
    res.send("ok");
})

app.get("*", (req,res) => {
    // console.log(`[ENDPOINT] ${req.method} ${req.url}`);
    res.send("Resource not found");
})

// nc -l 192.168.1.102 8000

export default app;