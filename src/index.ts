import * as express from "express";
import * as cors from "cors";
import { AppDataSource } from "./data-source"
import router from './routes'
import { redisClient } from "./libs/redis";

AppDataSource.initialize().then(async () => {
    const app = express();
    const port = 5000;

    redisClient.on("error", (err) => console.log("Redis Client Error", err));
    app.use(express.json());
    app.use(cors())
    app.use("/api/v1", router);

    app.listen(port,async ()=>{
        await redisClient.connect();
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(error => console.log(error))
