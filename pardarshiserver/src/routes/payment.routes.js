const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Triggered by the user clicking "Pay" on the frontend
router.post('/initiate', paymentController.initiateFormPayment);

// Configured in Cashfree Dashboard to receive async updates
router.post('/webhook', express.json(), paymentController.cashfreeWebhook);

module.exports = router;