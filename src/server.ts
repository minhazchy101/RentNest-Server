import { app } from "./app"
import config from "./config";
import { prisma } from "./lib/prisma";


const port = config.port;

async function main() {
    try {
         await prisma.$connect();
          console.log("Prisma is running..");

        app.listen(port, ()=>{
       console.log(`Example app listening on port http://localhost:${port}`);
    })
} catch (error) {
    console.log(`Error from app ${error}`);
    await prisma.$disconnect();
        process.exit(1)
    }
}
main()