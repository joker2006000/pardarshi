const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allows your HTML file to make requests to this server
app.use(express.json()); // Parses incoming JSON requests

// Replace with your actual OTP API Key
const OTP_API_KEY = 'd860993d1bc817f46ec9347f02f81484'; 

app.post('/send-otp', async (req, res) => {
    // 1. Receive the mobile number from the frontend
    const { phone } = req.body;

    // 2. Validate input
    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required.' });
    }

    // 3. Make the request to the external OTP API
    try {
        // Note: Using Node's built-in fetch (Requires Node.js 18+)
        const response = await fetch('https://api.otp.dev/v1/verifications', {
            method: 'POST',
            headers: {
                'X-OTP-Key': OTP_API_KEY,
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    channel: "sms",
                    sender: "OTP Dev",
                    phone: phone, // Must be digits without spaces/special chars + country code
                    template: "db45a10a-0fb9-4198-bda8-2b5d6b077f57", //need update
                    code_length: 4
                }
            })
        });

        const data = await response.json();

        // 4. Return the API response back to the frontend
        if (response.ok) {
            res.status(200).json(data);
        } else {
            res.status(response.status).json(data);
        }
    } catch (error) {
        console.error('OTP API Error:', error);
        res.status(500).json({ error: 'Internal Server Error while communicating with OTP provider.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});


app.post('/verify-otp', async (req, res) => {
    const { phone, code } = req.body;

    if (!phone || !code) {
        return res.status(400).json({ error: 'Phone number and code are required.' });
    }

    try {
        // Call the GetOTP verification endpoint
        const response = await fetch(`https://api.otp.dev/v1/verifications?phone=${phone}&code=${code}`, {
            method: 'GET',
            headers: {
                'X-OTP-Key': OTP_API_KEY,
                'accept': 'application/json'
            }
        });

        const data = await response.json();

        // The API returns an empty array if the code is invalid/expired
        if (response.ok && data.data && data.data.length > 0) {
            res.status(200).json({ success: true, message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});