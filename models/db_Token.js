const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    value: {
        type: String,
        required: true
    },

    expires_on: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('Tokens', TokenSchema);
