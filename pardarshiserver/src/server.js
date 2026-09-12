require('dotenv').config();
const app = require('./app');
const pool = require('./config/db'); // Ensures DB connects on startup

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});