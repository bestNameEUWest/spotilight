var express = require('express');
var router = express.Router();


let db = require('../modules/mongodb_handler');
let audio_analysis_handler = require('../modules/audio_analysis_handler');
//let espHandler = new (require('../modules/esp8266_handler'))();
let ESPHandler = require('../modules/esp8266_handler');
let espHandler = new ESPHandler();

router.get('/playstate', async (req, res, next) => {
    let song_id = req.query.song_id;
    let position = req.query.position;
    let paused = (req.query.paused === 'true');

    espHandler.songInfoHandler(song_id, position, paused);

    res.status(200);
    res.send('ok')
});

router.post('/songs/:id', async (req, res, next) => {
    let song_id = req.params.id;
    let song = await audio_analysis_handler.getAudioAnalysis(song_id);
    let value = await db.addSong(song);
    if(value) {
        console.log('ADDED id: ' + song_id);
    } else {
        console.log('REJECTED id: ' + song_id);
    }
    res.status(200);
    res.send();
});

module.exports = router;
