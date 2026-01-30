
const UNOSEND_API_URL = 'https://www.unosend.co/api/v1/emails';
const API_KEY = import.meta.env.VITE_UNOSEND_API_KEY;

interface EmailParams {
    to: string;
    subject: string;
    html: string;
    from?: string; // Optional, defaults to system
}

export const sendEmail = async ({ to, subject, html, from = 'Noir Labs <system@noirlabs.ai>' }: EmailParams) => {
    if (!API_KEY) {
        console.error('Unosend API Key is missing in .env');
        return { success: false, error: 'API Key missing' };
    }

    try {
        const response = await fetch(UNOSEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                from,
                to,
                subject,
                html
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Unosend Error:', JSON.stringify(errorData, null, 2));
            return { success: false, error: errorData };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error };
    }
};

export const sendWelcomeEmail = async (email: string, name?: string) => {
    const html = `
    <div style="font-family: sans-serif; background-color: #f5f5f5; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border: 4px solid black; border-radius: 20px; overflow: hidden; box-shadow: 10px 10px 0px #000;">
            <div style="background: #000; padding: 20px; text-align: center;">
                <h1 style="color: #fff; text-transform: uppercase; letter-spacing: 4px; margin: 0;">Access Granted</h1>
            </div>
            <div style="padding: 40px;">
                <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 20px;">Welcome back, ${name || 'Agent'}.</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #333;">
                    Your secure connection to <strong>Noir Labs</strong> has been re-established. 
                    The experiments are waiting for your input.
                </p>
                <div style="margin: 30px 0; text-align: center;">
                    <a href="https://noirlabs.ai" style="display: inline-block; background: #05ffa1; color: #000; padding: 15px 30px; font-weight: 900; text-decoration: none; border: 2px solid #000; border-radius: 10px; text-transform: uppercase; box-shadow: 4px 4px 0px #000;">
                        Enter Laboratory
                    </a>
                </div>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                    "Science is magic that works."
                </p>
            </div>
            <div style="background: #f0f0f0; padding: 15px; text-align: center; border-top: 2px solid #000; font-size: 12px; color: #888;">
                © 2024 NOIR LABS. Secure transmission.
            </div>
        </div>
    </div>
    `;

    return sendEmail({
        to: email,
        subject: 'ACCESS GRANTED: Welcome to Noir Labs',
        html
    });
};

export const sendWaitlistEmail = async (email: string) => {
    const html = `
    <div style="font-family: sans-serif; background-color: #f5f5f5; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border: 4px solid black; border-radius: 20px; overflow: hidden; box-shadow: 10px 10px 0px #000;">
            <div style="background: #ff71ce; padding: 20px; text-align: center; border-bottom: 4px solid black;">
                <h1 style="color: #000; text-transform: uppercase; letter-spacing: 3px; margin: 0; font-weight: 900;">Waitlist Confirmed</h1>
            </div>
            <div style="padding: 40px;">
                <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 20px;">You're on the list! 🧪</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #333;">
                    We have received your request for early access. You are now in the queue for <strong>Noir Labs Public Beta</strong>.
                </p>
                <p style="font-size: 16px; line-height: 1.6; color: #333;">
                    We are gradually opening access to ensure system stability. Watch your inbox for your exclusive invite code.
                </p>
                <div style="margin: 30px 0; padding: 20px; background: #fffb96; border: 2px solid black; border-radius: 10px; transform: rotate(-1deg);">
                    <strong>Status:</strong> Pending Approval<br>
                    <strong>Priority:</strong> Standard
                </div>
            </div>
            <div style="background: #000; padding: 15px; text-align: center; font-size: 12px; color: #fff;">
                NOIR LABS // EXPERIMENTAL DIVISION
            </div>
        </div>
    </div>
    `;

    return sendEmail({
        to: email,
        subject: 'WAITLIST CONFIRMED: You are in queue',
        html
    });
};
