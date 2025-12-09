import express from "express";
import cors from "cors";
import cookieParsar from "cookie-parser";


const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: '20kb'}))
app.use(express.urlencoded({extended: true, limit: '20kb'}))

app.use(express.static('public'))

app.use(cookieParsar())


// routes import

import userRouter from "../src/routes/user.routes.js";



// routes declartion
app.use("/api/v1/users", userRouter);





// Home route
app.get("/", (req, res) => {
  res.send("Welcome Joydev Backend API_1.0!");
}); 

export { app }