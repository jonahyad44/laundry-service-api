import express, { Request, Response } from "express";
import bcrypt from 'bcrypt';
const jwt = require("jsonwebtoken");
import { env } from "node:process";
import { PrismaClient } from "@prisma/client";
const cors = require("cors");
import bodyParser from 'body-parser';
require('dotenv').config();
const cookieParser = require("cookie-parser");
const router = express.Router();

const prisma = new PrismaClient();

router.use(cors());
router.use(express.json());
router.use(cookieParser());
router.use(bodyParser.json());

//new user
router.post("/signup", async (req, res) => {
    try {
        const username: string = req.body.username;
        const hashPass: string = await bcrypt.hash(req.body.password, 10);
        await prisma.admin.create({
            data: {
                username: username,
                password: hashPass,
            },
        });
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

//validate user credidentials
router.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await prisma.admin.findFirst({
        where: { username: username },
    });
    if(!user) {
        return res.status(400).send("User not found");
    }

    const correct = await bcrypt.compare(user.password, password);
    if (!correct) {
        res.sendStatus(403);
    } else {
        const token: string = jwt.sign(username, env.JWT_SECRET_KEY);
        res.status(201).json(token);
    }
});

router.post("/checkToken", (req: Request, res: Response) => {
    const token = req.body.token;
    if(token) {
        jwt.verify(token, env.JWT_SECRET_KEY, (err: Error, user: string) => {
            if (err) {
                res.sendStatus(403);
            } else {
                res.status(200).json(user);
            }
        });
    } else {
        res.sendStatus(401);
    }
});


export default router;