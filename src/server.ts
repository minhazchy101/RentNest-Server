import { app } from "./app"
import config from "./config";


const port = config.port;

async function main() {
    try {
        app.listen(port, ()=>{
       console.log(`Example app listening on port http://localhost:${port}`);
    })
} catch (error) {
        console.log(`Error from app ${error}`);
        process.exit(1)
    }
}
main()