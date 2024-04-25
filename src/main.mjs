import app from "./router.mjs";
import storage from "./storage.mjs";

import { appstate, TEMP_STATE_LOW, TEMP_STATE_HIGH, TEMP_STATE_OK } from "./settings.mjs";

// const HOSTNAME = "127.0.0.1";
const HOSTNAME = "192.168.1.102";
const PORT = 8000;

const UPDATE_INTERVAL_IN_SECONDS = 2.0;

const LOW_TEMP_LIMIT = 17;
const HIGH_TEMP_LIMIT = 30;

// storage.init(":memory:");
storage.init("db");
storage.initTables();

storage.getData(true)
.then( (data) => {
    appstate.temp = data ? data.temp : 20;
    appstate.hum = data ? data.hum : 50;
   
})

app.listen(PORT,HOSTNAME, () => {
    console.log(`Listening at ${HOSTNAME}:${PORT}`)
})

setInterval(() => {
    if (appstate.temp  <= LOW_TEMP_LIMIT) {
        appstate.tempState = TEMP_STATE_LOW;
        appstate.mcustate.ledState = 1;
    }else if (appstate.temp  >= HIGH_TEMP_LIMIT) {
        appstate.tempState = TEMP_STATE_HIGH;
        appstate.mcustate.ledState = 1;
    }else {
        appstate.tempState = TEMP_STATE_OK;
        appstate.mcustate.ledState = 0;
    }
    console.log("Temp: "+appstate.temp );
}, 1000 * UPDATE_INTERVAL_IN_SECONDS);