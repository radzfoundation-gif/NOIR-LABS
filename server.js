import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Endpoint untuk membuat Invoice Xendit
app.post('/api/create-invoice', async (req, res) => {
    try {
        const { external_id, amount, payer_email, description, currency } = req.body;
        const secretKey = process.env.XENDIT_SECRET_KEY;

        if (!secretKey) {
            return res.status(500).json({ error: 'Server configuration error: XENDIT_SECRET_KEY missing' });
        }

        const token = Buffer.from(secretKey + ':').toString('base64');

        const response = await axios.post(
            'https://api.xendit.co/v2/invoices',
            {
                external_id,
                amount,
                payer_email,
                description,
                invoice_duration: 86400, // 24 jam
                currency: currency || 'IDR',
                success_redirect_url: 'http://localhost:5173/profile?payment=success',
                failure_redirect_url: 'http://localhost:5173/pricing?payment=failed'
            },
            {
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Xendit API Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'Failed to create invoice',
            details: error.response?.data || error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Payment Server running at http://localhost:${port}`);
});
