var express = require('express');
var router = express.Router();

let spotify_authflow = require('../modules/spotify_authflow');

/* GET home page. */
// router.get('/', function(req, res, next) {
//
// });

router.get('/login', function(req, res, next) {
  spotify_authflow.login(req, res, next);
});

router.get('/callback', function(req, res, next) {
  spotify_authflow.callback(req, res, next);
});

router.post('/accessToken', function (req, res, next) {
  let data = {
    'access_token': req.session.access_token
  };
  res.type('application/json');
  res.status(200);
  res.send(data)
});

module.exports = router;
