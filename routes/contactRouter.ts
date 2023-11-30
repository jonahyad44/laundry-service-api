import express from "express";
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");


router.use(cors());
router.use(express.json());

const transporter = nodemailer.createTransport({
    host: "stmp.example.com",
    post: '587',
    auth: {
        user: 'user1',
        password: 'user1',
    },
});

router.post("/contactform", async (req, res) => {
    try {
        console.log(req.body);
        const {name} = req.body;
        const {email} = req.body;
        const {message} = req.body;

        if (!name) throw new Error("Name is required");
        if (!email) throw new Error('Email is required');
        if(!message) throw new Error('Message is required');
        const option = { name, email, message};
        const result = await transporter.sendMail(option);

        res.json({
            message: 'Email sent',
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: true})
    }

 });

 export default router;


    
