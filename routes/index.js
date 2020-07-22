var express = require('express');
var router = express.Router();

let spotify_authflow = require('../modules/spotify_authflow');

// TODO: enable refreshing logic by creating different route or serving index as template
router.get('/', function(req, res, next) {
  console.log('route test')
  if(req.session['refresh_token']){
    console.log('has refresh')
    spotify_authflow.refreshToken(req, res)

  }
  else{
    console.log('has no refresh')
    res.redirect('/login')

  }

});

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
