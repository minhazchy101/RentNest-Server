import cookieParser from "cookie-parser";
import express,{ Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { authRoutes } from "./modules/Authentication/auth.routes";
import { categoryRoutes } from "./modules/Category/category.routes";
import { propertyRoutes } from "./modules/Propertry/property.routes";

export const app : Application = express();



app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get("/", async(req: Request, res: Response)=>{
    res.send("Hello RentNest..");
})

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);

