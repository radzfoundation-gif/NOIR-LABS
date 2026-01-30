import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { external_id, amount, payer_email, description, currency } = req.body;
        const secretKey = process.env.XENDIT_SECRET_KEY;

        if (!secretKey) {
            return res.status(500).json({ error: 'Server configuration error: XENDIT_SECRET_KEY missing' });
        }

        const token = Buffer.from(secretKey + ':').toString('base64');

        // Determine redirect URLs based on the request origin or default to localhost
        const origin = req.headers.origin || 'http://localhost:5173';

        const response = await axios.post(
            'https://api.xendit.co/v2/invoices',
            {
                external_id,
                amount,
                payer_email,
                description,
                invoice_duration: 86400, // 24 hours
                currency: currency || 'IDR',
                success_redirect_url: `${origin}/profile?payment=success`,
                failure_redirect_url: `${origin}/pricing?payment=failed`
            },
            {
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json(response.data);
    } catch (error: any) {
        console.error('Xendit API Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'Failed to create invoice',
            details: error.response?.data || error.message
        });
    }
}
