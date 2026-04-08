const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // Ye process.env.JWT_SECRET wahi hai jo humne .env mein dala tha
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token 30 din tak chalega
    });
};

module.exports = generateToken;