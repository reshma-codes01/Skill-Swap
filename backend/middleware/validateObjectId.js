const mongoose = require('mongoose');

/**
 * Middleware to validate if the specified parameter is a valid Mongoose ObjectId.
 * This prevents casting errors that can crash the server.
 * @param {string} paramName - The name of the parameter in req.params to validate.
 */
const validateObjectId = (paramName = 'id') => (req, res, next) => {
    const id = req.params[paramName];
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: `Invalid ID format for ${paramName}: ${id}`
        });
    }
    
    next();
};

module.exports = validateObjectId;
