const mongoose = require('mongoose');

const SongSchema = mongoose.Schema({
    version: {
        type: Number,
        required: true
    },

    id: {
        type: String,
        required: true,
        unique: true
    },

    bars: [{
        start: { type: Number },
        duration: { type: Number }
    }],

    beats: [{
        start: { type: Number },
        duration: { type: Number }
    }],

    sections: [{
        start: { type: Number },
        duration: { type: Number },
        loudness: { type: Number },
        tempo: { type: Number },
        key: { type: Number },

    }],

    segments: [{
        start: { type: Number },
        duration: { type: Number },
        loudness_start: { type: Number },
        pitches: [Number],
        timbre: [Number]
    }],

});

module.exports = mongoose.model('Songs', SongSchema);
