import { describe,it } from "mocha";
import { expect } from "chai";

import sqlite3 from "sqlite3";
sqlite3.verbose();

import storage from "../src/storage.mjs";

/** @param db{sqlite3.Database} */
function initTables(db) {
    
}

function waitForSeconds(seconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000);
    })
}

/** @type{sqlite3.Database} */
let db = undefined; 
describe("Test sqlite3", () => {
    before( (done) => {
        storage.init(":memory:");
        done();
    });
    it ("Init tables", async () => {
        let err = await storage.initTables();
        expect(err).to.be.null;
    });
    it ("Read latest data", async () => {
        const datas = [{temp:24,hum:50},{temp:28,hum:40},{temp:20,hum:20}];
        for (const d of datas) {
            await storage.addData(d.temp, d.hum);
            await waitForSeconds(1);
        }
        const rows = await storage.getAllData();
        expect(rows).to.not.be.undefined;
        expect(rows.length).to.eq(3);
        for (const [i,row] in rows.entries()) {
            expect(row).to.not.be.undefined;
            expect(row.temp).to.eq(datas[0].temp);
            expect(row.hum).to.eq(datas[0].hum);
        }

        const data = await storage.getData();
        expect(data).to.not.be.undefined;
        expect(data.temp).to.eq(20);
    })
    // it ("Add data", async () => {
    // })
    // it ("Query table", async (done) => {
    // });
    after( () => {
        storage.dispose();
    });
});