const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Route Imports
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev')); // Logging

// Mount Routes
app.use('/api/auth', authRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send('PARDARSHI API is running...');
});

module.exports = app;