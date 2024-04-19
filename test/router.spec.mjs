import { before, describe,it } from "mocha";
import { expect } from "chai";
import routes from "../src/router.mjs";
import storage from "../src/storage.mjs";

/** @type {import("node:http").Server} */
let server = undefined;

const BASE_URL = "127.0.0.1"
const PORT = 8000;
const FULL_URL = `http://${BASE_URL}:${PORT}`;

const waitForSeconds = async (seconds) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000);
    })
}

describe("Routes", () => {
    before ((done) => {
        storage.init(":memory:");
        server = routes.listen(PORT, BASE_URL, () => done());
    })
    it ("Can get welcome", async () => {
        const response = await fetch(FULL_URL);
        // expect(response.status).to.be.eq("Welcome");
        // expect(1).to.be.eq(1);
    });
    it ("Can get led", async () => {
        let resp = await fetch(`${FULL_URL}/get-ledstate`);
        expect(resp.status).to.eq(200, "Incorrect status code");
        let txt = await resp.text();
        expect(txt).to.be.eq("0");
        const state = 1;
        resp = await fetch(`${FULL_URL}/set-ledstate?state=1`);
        expect(resp.status).to.eq(200, "Incorrect status code");
        resp = await fetch(`${FULL_URL}/get-ledstate`);
        expect(resp.status).to.eq(200, "Incorrect status code");
        txt = await resp.text();
        expect(txt).to.be.eq("1");
    });
    
    it ("Can read data", async () => {
        const sensorData = [{temp:23.0, hum:40},{temp:25.0, hum:30},{temp:30.0, hum:50},{temp:28.0, hum:28}];
        for (let i = 0; i < sensorData.length; i++) {

            let resp = await fetch(`${FULL_URL}/get-data`);
            expect(resp.status).to.eq(200, "Incorrect status code");
            expect(resp.headers.get("Content-Type")).to.eq("application/json; charset=utf-8", "Incorrec content type");
            let data = await resp.json();
            expect(data).to.not.be.null;
            expect(data.temp).to.eq(sensorData[i].temp);
            expect(data.hum).to.eq(sensorData[i].hum);
        }
    });
    it ("Can post data", async () => {
        const temp = 23.0;
        const hum = 50.0;
        let resp = await fetch(`${FULL_URL}/post-data?temp=${temp}&hum=${hum}`);
        expect(resp.status).to.eq(200, "Incorrect status code");
        resp = await fetch(`${FULL_URL}/post-data?temp=${30}&hum=${45}`);
        expect(resp.status).to.eq(200, "Incorrect status code");
    })
    after( () => {
        server.close();
        storage.dispose();
    });
});