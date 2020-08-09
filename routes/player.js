var express = require('express');
let db = require('../modules/mongodb_handler');
var router = express.Router();

router.get('/playstate', async (req, res, next) => {
    let db_token = await db.getToken('access_token');
    let token = {
        name: db_token.name,
        value: db_token.value
    };
    let paused_event = req.query.paused;
    let paused_state = req.session.paused;
    if(paused_state === undefined)
        req.session.paused = paused_event;
    else if (paused_state !== paused_event) {
        req.session.paused = paused_event
        // TODO: esp handler




    }

    console.log(req.query);
    res.status(200);
    res.send('ok')
});


router.get('/songs/:id', (req, res, next) => {
    let b = req.params.id;
    res.status(200);
    res.send('ok')
});


router.post('/songs/:id', (req, res, next) => {
    let b = req.body;
    console.log(b);
    res.status(200);
    res.send('ok')
});

module.exports = router;
