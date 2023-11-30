import express from "express";
const router = express.Router();
const cors = require("cors");
router.use(cors());
router.use(express.json());

router.post('/submitorder', async (req, res) => {
    try {
        const {name , zipCode, addressOne} = req.body;

        if(!name) {
            return res.status(400).json({ error: 'Name is missing'})
        }

        if(!zipCode) {
            return res.status(400).json({ error: 'Zipcode is missing'})
        }

        if(!addressOne) {
            return res.status(400).json({ error: 'Address is missing'})
        }

        res.status(200).json({ message: 'Order form submitted'})
    } catch (error) {
        console.error('Error submitting order form:', error);
        res.status(500).json({ error:  'Internal service error'})
    }
    });

export default router;
