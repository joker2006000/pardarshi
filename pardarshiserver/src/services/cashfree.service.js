const axios = require('axios');

const cashfreeApi = axios.create({
    baseURL: process.env.CASHFREE_API_URL,
    headers: {
        'x-client-id': process.env.CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
        'x-api-version': process.env.CASHFREE_API_VERSION,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

exports.createVendor = async (vendorData) => {
    try {
        const payload = {
            vendor_id: vendorData.vendor_id,
            name: vendorData.name,
            email: vendorData.email,
            phone: vendorData.phone,
            bank: vendorData.bank_account ? [
                {
                    account_number: vendorData.bank_account,
                    account_holder: vendorData.name,
                    ifsc: vendorData.ifsc
                }
            ] : [],
            upi: vendorData.upi_id ? [
                {
                    vpa: vendorData.upi_id,
                    account_holder: vendorData.name
                }
            ] : []
        };
        const response = await cashfreeApi.post('/vendors', payload);
        return response.data;
    } catch (error) {
        console.error("Cashfree Vendor Creation Error:", error.response?.data || error.message);
        throw new Error("Failed to create vendor in Cashfree");
    }
};

exports.createOrder = async (orderData) => {
    try {
        const payload = {
            order_id: orderData.order_id,
            order_amount: orderData.amount,
            order_currency: 'INR',
            customer_details: {
                customer_id: orderData.customer_id,
                customer_name: orderData.customer_name,
                customer_email: orderData.customer_email || "noemail@example.com",
                customer_phone: orderData.customer_phone
            },
            // Order tags hold the DB IDs for the webhook retrieval
            order_tags: orderData.tags, 
            order_meta: {
           return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-status?order_id=${orderData.order_id}`
            },
            order_splits: [
                {
                    vendor_id: orderData.vendor_id,
                    percentage: 100
                }
            ]
        };
        const response = await cashfreeApi.post('/orders', payload);
        return response.data;
    } catch (error) {
        console.error("Cashfree Order Creation Error:", error.response?.data || error.message);
        throw new Error("Failed to create Cashfree order");
    }
};




exports.verifyConnection = async () => {
    try {
        // We try to fetch a fake order to test the connection.
        await cashfreeApi.get('/orders/test_connection_123');
        return true; 
    } catch (error) {
        // If the status is 401, it means the API keys are definitely wrong or missing
        if (error.response && error.response.status === 401) {
            throw new Error("Cashfree Authentication Failed: Check your Client ID and Secret in the .env file.");
        }
        // If the status is 404 (Not Found), it means the connection and authentication WORKED, 
        // Cashfree just couldn't find the fake order (which is exactly what we expect).
        return true;
    }
};