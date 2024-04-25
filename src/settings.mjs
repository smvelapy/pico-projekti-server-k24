const TEMP_STATE_OK = 0;
const TEMP_STATE_LOW = 1;
const TEMP_STATE_HIGH = 2;
// const appstate = {
//     tempState:TEMP_STATE_OK,
//     humState:0
// };

class AppState {
    constructor() {
        this.temp = 0;
        this.hum = 0;
        this.sensorMode = 0;
        this.sensorReaded = 0;

        this.tempState = TEMP_STATE_OK;
        this.humState = 0;
        this.mcustate = {
            ledState:0
        };
    }
    
    getAppstate() {
        return {
            temp:this.temp,
            hum:this.hum,
            sensorMode:this.sensorMode,
            sensorReaded:this.sensorReaded,
            tempState:this.tempState,
            humState:this.humState,
            ledState:this.mcustate.ledState
        };
    }
    getMcustate() {
        return this.mcustate;
    }
    updateLedstate(state) {
        this.mcustate.ledState = state;
    }
}

const appstate = new AppState();


export {appstate,TEMP_STATE_OK,TEMP_STATE_HIGH,TEMP_STATE_LOW};