import express, { Request, Response } from 'express';
import Stripe from 'stripe';
const router = express.Router();
const cors = require("cors");

router.use(express.json());
router.use(cors());

const stripe = new Stripe('sk_test_51ODvYwDEtVoGXwUaSYKqzFhtt9WYjxTh3D3kJtxMGkWvZGeEni0VDmgAXkiG28VRCcMlqEnCRwB9CqcgbDE2bURW00JW1Wkp5g', {
    apiVersion: '2023-10-16', // Specify the API version
  });

  router.get('/api/orders', async (req: Request, res: Response) => {
    try {
      // Assuming you have stored customer IDs when processing orders
      const customerID = 'your-customer-id'; // Replace with actual customer ID
  
      // Fetch orders associated with the customer from Stripe
      const orders = await stripe.orders.list({
        customer: customerID,
      });
  
      res.json(orders.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

export default router;
