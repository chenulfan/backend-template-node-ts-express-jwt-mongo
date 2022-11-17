import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from './routes/auth.route'
import * as dotenv from 'dotenv'
import { authTokenMiddleware } from "./midllewares/auth.middleware";
import UserRoute from "./routes/user.route";
import bearerToken from "express-bearer-token";

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json())
app.use(bearerToken())
app.use(authRoutes)
app.use(UserRoute)

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER_NAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.lz1bxnv.mongodb.net/?retryWrites=true&w=majority`);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => console.log("DB Connected successfully"));

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log(`Server is running here https://localhost:${PORT}`));



// Remove Later
app.get('/health', (req, res) => {
    res.send("authenticated health check")
})

app.get('/auth/health', authTokenMiddleware, (req, res) => {
    res.send("health check")
})

