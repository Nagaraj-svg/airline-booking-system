require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://test:test123@cluster0.mongodb.net/airline-booking?retryWrites=true&w=majority',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRE: '24h'
};
