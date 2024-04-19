import app from "./router.mjs";
import storage from "./storage.mjs";

const HOSTNAME = "127.0.0.1";
const PORT = 8000;

storage.init(":memory:");
storage.initTables();

app.listen(PORT,HOSTNAME, () => {
    console.log(`Listening at ${HOSTNAME}:${PORT}`)
})