var express = require('express');
let db = require('../modules/mongodb_handler');
var router = express.Router();

router.get('/playstate', async (req, res, next) => {
    let paused_event = req.query.paused;
    let paused_state = req.session.paused;
    if(paused_state === undefined)
        req.session.paused = paused_event;
    else if (paused_state !== paused_event) {
        req.session.paused = paused_event
        // TODO: esp handler




    }
    res.status(200);
    res.send('ok')
});


router.get('/songs/:id', async (req, res, next) => {
    let song_id = req.params.id;
    let has_song = await db.hasSong(song_id);
    if(has_song){
        res.status(200);
    } else {
        res.status(404);
    }
    res.send();
});


router.post('/songs/:id', (req, res, next) => {
    let song_id = req.params.id;
    console.log('Add song: ', song_id);
    res.status(200);
    res.send();
});

module.exports = router;
