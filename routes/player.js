var express = require('express');
var router = express.Router();

router.get('/playstate', (req, res, next) => {
    console.log(req.query);
    res.send('')
});


module.exports = router
