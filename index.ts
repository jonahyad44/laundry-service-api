const express = require("express");
const cors = require("cors");
import { PrismaClient } from "@prisma/client";
import loginRouter from "./routes/loginRouter";
import contactRouter from './routes/contactRouter';
import orderRouter from './routes/orderRouter';
import stripeRouter from './routes/stripeRouter';
import getOrders from './routes/getOrders';
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

export const prisma = new PrismaClient();
const app = express();
const port = 4000;

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser());


app.use("/users", loginRouter);
app.get("/api", getOrders);
app.use("/mail", contactRouter);
app.use("/form", orderRouter);
app.use("/data", stripeRouter);


app.listen(port, () => {
    console.log(`Sever is running on http://localhost:${port}`);
})

