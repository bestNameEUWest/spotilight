var express = require('express');
var router = express.Router();


let db = require('../modules/mongodb_handler');
let audio_analysis_handler = require('../modules/audio_analysis_handler');
//let espHandler = new (require('../modules/esp8266_handler'))();

let ESPHandler = require('../modules/esp8266_handler');
let PlayerImitator = require('../modules/player_imitator');
let songEvent = require('../modules/song_event');

let espHandler = new ESPHandler();
songEvent.addEspHandler(espHandler);
let playerImitator = new PlayerImitator(songEvent);

router.use(function (req, res, next) {
    if(!espHandler.connected()){
        espHandler.connect(res.io);
    }
    next()
});

router.get('/playstate', async (req, res, next) => {
    let song_id = req.query.song_id;
    let position = req.query.position;
    let paused = (req.query.paused === 'true');

    playerImitator.songInfoHandler(song_id, position, paused);

    res.status(200);
    res.send('ok')
});

router.post('/songs/:id', async (req, res, next) => {
    let song_id = req.params.id;
    let song = await audio_analysis_handler.getAudioAnalysis(song_id);
    await db.addSong(song);
    res.status(200);
    res.send();
});

module.exports = router;
