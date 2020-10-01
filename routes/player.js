var express = require('express');
var router = express.Router();


let db = require('../modules/mongodb_handler');
let audio_analysis_handler = require('../modules/audio_analysis_handler');
//let espHandler = new (require('../modules/esp8266_handler'))();
let ESPHandler = require('../modules/esp8266_handler');
let espHandler = new ESPHandler();

router.get('/playstate', async (req, res, next) => {
    espHandler.setPaused(req.query.paused);
    espHandler.setPosition(req.query.position);
    espHandler.setSongID(req.query.song_id);

    res.status(200);
    res.send('ok')
});


router.get('/songs/:id', async (req, res, next) => {
    let song_id = req.params.id;
    let has_song = await db.hasSong(song_id);
    console.log('has song 2: ' + has_song);
    if(has_song){
        res.status(200);
        console.log('has song!')
    } else {
        res.status(404);
        console.log('has not song!')
    }
    res.send();
});


router.post('/songs/:id', async (req, res, next) => {
    let song_id = req.params.id;

    //console.time('Analysis time for id: ' + song_id);
    let song = await audio_analysis_handler.getAudioAnalysis(song_id);
    await db.addSong(song);
    console.log('added song!');
    //console.timeEnd('Analysis time for id: ' + song_id);
    //console.log('Add song: ', song_id);
    res.status(200);
    res.send();
});

router.get('/playTest', async function (req, res) {
    res.redirect('/#')
});

router.get('/pauseTest', async function (req, res) {
    res.redirect('/#')
});


module.exports = router;
