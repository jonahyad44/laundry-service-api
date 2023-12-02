"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const node_process_1 = require("node:process");
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const jwt = require("jsonwebtoken");
const stripe = require('stripe')('sk_test_51ODvYwDEtVoGXwUaSYKqzFhtt9WYjxTh3D3kJtxMGkWvZGeEni0VDmgAXkiG28VRCcMlqEnCRwB9CqcgbDE2bURW00JW1Wkp5g');
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const STRIPE_SECRET_KEY = 'sk_test_51ODvYwDEtVoGXwUaSYKqzFhtt9WYjxTh3D3kJtxMGkWvZGeEni0VDmgAXkiG28VRCcMlqEnCRwB9CqcgbDE2bURW00JW1Wkp5g';
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.use((0, cors_1.default)());
app.use(cookieParser());
app.use(bodyParser());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        console.log("Username Recieved");
        const hashedPass = yield bcrypt_1.default.hash(req.body.password, 10);
        console.log("Password created");
        yield prisma.admin.create({
            data: {
                username: username,
                password: hashedPass,
            },
        });
        res.status(201).send();
    }
    catch (_a) {
        res.status(500).send();
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma.admin.findFirst({
        where: { username: username },
    });
    if (!user) {
        return res.status(400).send("Cannot find user");
    }
    if (yield bcrypt_1.default.compare(user.password, password)) {
        res.sendStatus(403);
    }
    else {
        const token = jwt.sign(username, process.env.JWT_SECRET_KEY);
        res.status(201).json(token);
    }
}));
app.post("/checkToken", (req, res) => {
    const token = req.body.token;
    if (token) {
        jwt.verify(token, node_process_1.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                res.sendStatus(403);
            }
            else {
                res.status(200).json(user);
            }
        });
    }
    else {
        res.sendStatus(401);
    }
});
app.post("/charge", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, token } = req.body;
        const charge = yield stripe.charges.create({
            amount,
            currency: 'usd',
            source: token,
        });
        // Handle successful payment (e.g., update database, send confirmation email)
        // Send a success response to the client
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error(error.message);
        // Handle errors and send a failure response to the client
        res.status(500).json({ error: 'Payment failed' });
    }
}));
app.post("/contactform", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message } = req.body;
    if (!name) {
        return res.status(400).send("name required");
    }
    if (!email) {
        return res.status(400).send('email required');
    }
    if (!message) {
        return res.status(400).send('message required');
    }
    else {
        res.status(200).send("Email sent");
    }
}));
app.get('/api/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get('https://api.stripe.com/v1/orders', {
            headers: {
                Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const orders = response.data.data;
        res.json({ orders });
    }
    catch (error) {
        console.error('Error retrieving orders:', error.response.data.error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.use((req, res, next) => {
    const nonce = crypto_1.default.randomBytes(16).toString('base64');
    res.setHeader('Content-Security-Policy', `default-src 'self'; script-src 'self' https://trusted-scripts.com 'nonce-${nonce}';`);
    res.locals.nonce = nonce;
    next();
});
app.listen(3001);
module.exports = app;
