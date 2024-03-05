import * as express from "express";
import * as cors from "cors";
import { AppDataSource } from "./data-source"
import router from './routes'

AppDataSource.initialize().then(async () => {
    const app = express();
    const port = 5000;

    app.use(express.json());
    app.use(cors())
    app.use("/api/v1", router);

    app.listen(port,()=>{
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(error => console.log(error))
