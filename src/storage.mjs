import sqlite3 from "sqlite3";

class Storage {
    constructor() {
        /** @type {sqlite3.Database} */
        this.db = undefined;
        /** @type { {temp:number,hum:number} } */
        this._cachedData = undefined;
    }
    init(path) {
        this.db = new sqlite3.Database(path);
    }
    initTables() {
        return new Promise( (resolve) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS sensor_data (
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
            ,[temp, hum], (err) => {
                resolve(err);
                if (this._cachedData == undefined) {
                    this._cachedData = {};
                }
                this._cachedData.temp = temp;
                this._cachedData.hum = hum;
            });
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
    getData(useCached = false) {
        if (useCached && this._cachedData) {
            return new Promise( (resolve) => {
                resolve(this._cachedData);
            });
        }
        return new Promise( (resolve) => {
            this.db.get(`SELECT temp,hum,unixepoch(timestamp) as timestamp FROM sensor_data
                        ORDER BY timestamp DESC LIMIT 1`, (err, row) => {
                resolve(row);      
            });
        })
    }
    /** @returns {Promise<object>} */
    getAllData() {
        return new Promise( (resolve) => {
            this.db.all(`SELECT temp,hum,unixepoch(timestamp) as timestamp FROM sensor_data`, (err, rows) => {
                resolve(rows);      
            });
        })
    }
    deleteAllData() {
        const sql = "DELETE FROM sensor_data";
        this.db.run(sql, (res, err) => {
            if (err) {
                console.log("deleteAllData failed");
            }else {
                console.log("deleteAllData succeed");
            }
        });
    }
    dispose() {
        this.db.close();
    }
}
const storage = new Storage();

export default storage;