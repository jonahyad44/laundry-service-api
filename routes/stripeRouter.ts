import express from "express";
const router = express.Router();
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51ODvYwDEtVoGXwUaSYKqzFhtt9WYjxTh3D3kJtxMGkWvZGeEni0VDmgAXkiG28VRCcMlqEnCRwB9CqcgbDE2bURW00JW1Wkp5g');
const cors = require("cors");
router.use(bodyParser.json());
router.use(express.json());
router.use(cors());

router.post('/charge', async (req, res) => {
    try {
        const { amount, token } = req.body;
        const charge = await stripe.charges.create({
            amount,
            currency: 'usd',
            source: token,
          });
      
          // Handle successful payment (e.g., update database, send confirmation email)
          // Send a success response to the client
          res.status(200).json({ success: true });
        } catch (error) {
          console.error(error.message);
          // Handle errors and send a failure response to the client
          res.status(500).json({ error: 'Payment failed' });
        }
      });
      
export default router;