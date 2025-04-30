import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortCode = process.env.MPESA_SHORTCODE;
const passkey = process.env.MPESA_PASSKEY;

export const generateToken = async (req, res, next) => {
    try {
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

        const response = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
            headers: {
                'Authorization': `Basic ${auth}`,
            }
        });

        req.token = response.data.access_token;
    
        next();
    } catch (error) {
        console.error('Error generating access token:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate access token' });
    }
};


export const callback = (req, res) => {
    const { Body } = req.body;

    if (Body.stkCallback) {
        const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

        // Process the callback data
        console.log('MerchantRequestID:', MerchantRequestID);
        console.log('CheckoutRequestID:', CheckoutRequestID);
        console.log('ResultCode:', ResultCode);
        console.log('ResultDesc:', ResultDesc);
        console.log('CallbackMetadata:', CallbackMetadata);

        // Add your logic to handle the transaction result here
        if (ResultCode === 0) {
            // Transaction successful
            const transactionDetails = {
                MerchantRequestID,
                CheckoutRequestID,
                ResultCode,
                ResultDesc,
                Amount: CallbackMetadata.Item.find(item => item.Name === 'Amount').Value,
                MpesaReceiptNumber: CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber').Value,
                Balance: CallbackMetadata.Item.find(item => item.Name === 'Balance') ? CallbackMetadata.Item.find(item => item.Name === 'Balance').Value : null,
                TransactionDate: CallbackMetadata.Item.find(item => item.Name === 'TransactionDate').Value,
                PhoneNumber: CallbackMetadata.Item.find(item => item.Name === 'PhoneNumber').Value
            };

            // Save the transaction details to the mock database
            transactions.push(transactionDetails);
            console.log('Transaction saved:', transactionDetails);
        } else {
            // Transaction failed
            console.error('Transaction failed:', ResultDesc);
        }
    } else {
        console.error('Invalid callback data:', req.body);
    }

    // Respond to Safaricom to acknowledge receipt of the callback
    res.status(200).json({ message: 'Callback received successfully' });
};

// Mock database
const transactions = [];
export const stkpush = async (req, res) => {
    try {
        const phone = req.body.phone.substring(1);
        const amount = req.body.amount;

        const date = new Date();
        const timestamp = date.toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

        const { data } = await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: `254${phone}`,
            PartyB: shortCode,
            PhoneNumber: `254${phone}`,
            CallBackURL: "https://mydomain.com/api/callback", // Ensure this URL is correct and publicly accessible
            AccountReference: `254${phone}`,
            TransactionDesc: "test",
        }, {
            headers: {
                "Authorization": `Bearer ${req.token}`,
            },
        });

        res.json(data);
    } catch (error) {
        console.error('Error in STK Push request:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
};