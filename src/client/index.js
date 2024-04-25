async function startClient() {
    const doc = document;
    // doc.querySelector("")
    // const el = doc.createElement("div");
    // el.innerHTML = "-";
    // doc.body.appendChild(el);

    

    // const resp = await fetch("/ledstate-get");
    // const val = await resp.text();
    // el.innerHTML = val;

    function print(msg) {
        const msgDiv = doc.createElement("div");
        msgDiv.innerHTML = msg;
        doc.body.appendChild(msgDiv);
    }

    /** @param isOn {boolean} */
    async function updateLed(isOn) {
        const state = isOn ? 1 : 0;
        const resp = await fetch(`/ledstate-put?state=${state}`);
        print("updateLed");
    }
    
    /** @type {HTMLInputElement} */
    const ledInput = doc.querySelector("#led-check");
    ledInput.onchange = (e) => {
        print("change: "+ledInput.checked);
        updateLed(ledInput.checked);
    }

    const tempValueEl = doc.querySelector("#temp-value");
    const humValueEl = doc.querySelector("#hum-value");

    const warningDiv = doc.querySelector("#temp-warning");

    const sensorReadedDiv = doc.querySelector("#sensor-readed");
    
    async function fetchData() {
        let resp = await fetch(`/appstate-get`);
        if (resp.status != 200) return;
        /** @type { {temp:number,hum:number,tempState:number,sensorMode:number,sensorReaded:number,ledState:number} } */
        let data = undefined;
        try {
            data = await resp.json();
        }catch(err) {}
        if (data != undefined) {
            //     if ( (data.temp == 0 || data.tmp != undefined) &&
            //         (data.hum == 0 || data.hum != undefined) ) {
            
            let sensorReaded = undefined;
            if (data.hasOwnProperty("sensorReaded")) {
                if (!isNaN(data.sensorReaded)) {
                    sensorReaded = parseInt(data.sensorReaded);
                }
            }
            console.log("sensorReaded: "+sensorReaded);
            if (sensorReaded != undefined) {
                switch (sensorReaded) {
                    case 0:
                        sensorReadedDiv.innerHTML = "Sensor offline";
                        break;
                    case 1:
                        sensorReadedDiv.innerHTML = "Reading sensor DHT20";
                        break;
                    case 2:
                        sensorReadedDiv.innerHTML = "Reading sesnor MCP9710";
                        break;
                }
            }else {
                sensorReadedDiv.innerHTML = "Sensor offline";
            }
            
            let temp,hum = undefined;
            if (data.hasOwnProperty("temp")) {
                if (!isNaN(data.temp)) {
                    temp = parseFloat(data.temp);
                    temp = (Math.round(data.temp * 10) / 10).toFixed(1);
                }
            }
            if (data.hasOwnProperty("hum")) {
                if (!isNaN(data.hum)) {
                    hum = parseFloat(data.hum);
                    hum = (Math.round(data.hum * 10) / 10).toFixed(1);
                }
            }
            // el.innerHTML
            if (sensorReaded != 0) {

                if (temp != undefined) {
                    tempValueEl.innerHTML = `${temp} C°`;
                }else {
                    tempValueEl.innerHTML = "Unkown";
                }
            }else {
                tempValueEl.innerHTML = "-";
            }
            if (sensorReaded == 1) {
                if (temp != undefined) {
                    humValueEl.innerHTML = `${hum} RH`;
                }else {
                    humValueEl.innerHTML = `Unkown`;
                }
            }else {
                humValueEl.innerHTML = "-";
            }
            if (data.hasOwnProperty("ledState")) {
                ledInput.checked = data.ledState;
            }
            if (data.hasOwnProperty("tempState")) {
                if (!isNaN(data.tempState)) {
                    switch (data.tempState) {
                        case 0:
                            warningDiv.className = "hidden"
                            break;
                        case 1:
                            warningDiv.className = ""
                            warningDiv.innerHTML = "Low temperature warning!";
                            break;
                        case 2:
                            warningDiv.className = ""
                            warningDiv.innerHTML = "High temperature warning!";
                            break;
                    }
                }
            }
                // }
                // print(data);
                // print("Updated");
        }else {
            // No data available;
        }
    }
    
    fetchData();
    setInterval(() => {
        fetchData();

        // print("update");
        
    }, 2 * 1000);

}
startClient();