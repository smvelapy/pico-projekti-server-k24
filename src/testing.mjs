import sqlite3 from "sqlite3";

sqlite3.verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE lorem (info TEXT)");

    db.run(`CREATE TABLE sensor_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT not null,
        tmp FLOAT not null,
        hum FLOAT not null,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );`);
    // 2024-04-18 20:33:53

    let stmt = db.prepare(`INSERT INTO sensor_data(tmp, hum) VALUES (?, ?)`);
    stmt.run(20, 40);
    stmt.run(30, 10);
    stmt.finalize();
    
    stmt = db.prepare(`INSERT INTO sensor_data(tmp, hum, timestamp) VALUES (?, ?, ?)`);
    for (let i = 0; i < 5; i++) {
        let day = ""+(i+1);
        day = day.length < 2 ? ("0"+day) : day;
        const time = `2024-04-${day} 20:00:00`;
        stmt.run(20.5, 20.25, time);
    }
    stmt.finalize();

    db.each(`SELECT tmp,hum,date(timestamp, 'localtime') AS time  FROM sensor_data`, (err, row) => {
    // db.each(`SELECT tmp,hum,timestamp AS time  FROM sensor_data`, (err, row) => {
        console.log(row);
    });

    // const date1 = new Date(2024, 4, 1);
    // const date2 = new Date(2024, 4, 10);
    // const timeDiff = date2.getTime() - date1.getTime();

    // db.each(`SELECT tmp,hum,unixepoch(timestamp) AS time FROM sensor_data
    // WHERE time < ${date2.getTime()};`, (err, row) => {
    //     console.log(row);
    //     console.log(new Date(row.time).toISOString() );
    // });
        

    // const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    // for (let i = 0; i < 10; i++) {
    //     stmt.run("Ipsum " + i);
    // }
    // stmt.finalize();

    // db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
    //     console.log(row.id + ": " + row.info);
    // });
});

db.close();
