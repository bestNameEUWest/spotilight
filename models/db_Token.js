const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
    access_token: {
        type: String,
        required: true
    },

    refresh_token: {
        type: String,
        required: true
    }
});
