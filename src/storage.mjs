import sqlite3 from "sqlite3";

class Storage {
    constructor() {
        /** @type {sqlite3.Database} */
        this.db = undefined;
    }
    init(path) {
        this.db = new sqlite3.Database(path);
    }
    initTables() {
        return new Promise( (resolve) => {
            this.db.run(`CREATE TABLE sensor_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT not null,
                temp FLOAT not null,
                hum FLOAT not null,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );`, (err) => {console.log("err: "+err);resolve(err)});
        })
    }
    /**
     * 
     * @param {number} temp 
     * @param {number} hum 
     */
    addData(temp, hum) {
        return new Promise ( (resolve) => {
            this.db.run("INSERT INTO sensor_data(temp, hum) VALUES(?, ?)"
            ,[temp, hum], (err) => resolve(err));
        })
    }
    /** @returns {Promise<Array>} */
    getAllData() {
        return new Promise( (resolve) => {
            this.db.all("SELECT temp,hum FROM sensor_data ORDER BY timestamp DESC", (err, rows) => {
                // console.log(rows);
                resolve(rows);      
            });
        })
    }
    /** @returns {Promise<object>} */
    getData() {
        return new Promise( (resolve) => {
            this.db.all(`SELECT temp,hum FROM sensor_data
                        ORDER BY timestamp DESC LIMIT 1 `, (err, rows) => {
                resolve(rows[0]);      
            });
        })
    }
    dispose() {
        this.db.close();
    }
}
const storage = new Storage();

export default storage;