async function startClient() {
    const doc = document;
    // doc.querySelector("")
    const el = doc.createElement("div");
    el.innerHTML = "-";
    doc.body.appendChild(el);

    const resp = await fetch("/get-ledstate");
    const val = await resp.text();
    el.innerHTML = val;

    function print(msg) {
        const msgDiv = doc.createElement("div");
        msgDiv.innerHTML = msg;
        doc.body.appendChild(msgDiv);
    }

    /** @param isOn {boolean} */
    async function updateLed(isOn) {
        const state = isOn ? 1 : 0;
        const resp = await fetch(`/set-ledstate?state=${state}`);
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

    async function fetchData() {
        let resp = await fetch(`/get-data`);
        if (resp.status != 200) return;
        let data = undefined;
        try {
            data = await resp.json();
        }catch(err) {}
        if (data != undefined) {
            //     if ( (data.temp == 0 || data.tmp != undefined) &&
            //         (data.hum == 0 || data.hum != undefined) ) {
                
                tempValueEl.innerHTML = ""+data.temp;
                humValueEl.innerHTML = ""+data.hum;
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