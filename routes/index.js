var express = require('express');
var router = express.Router();
let db = require('../modules/mongodb_handler');

let spotify_authflow = require('../modules/spotify_authflow');

/*
router.get('/refreshToken', function(req, res, next) {
  console.log('route test');
  console.log('Refresh Token:', req.session['refresh_token'])
  if(req.session['refresh_token']){
    spotify_authflow.refreshToken(req, res)
    res.redirect('http://localhost:3000')
  }
  else{
    console.log('redirection')
    res.redirect('/login')
  }

});

 */

router.get('/login', function(req, res, next) {
  spotify_authflow.login(req, res, next);
});

router.get('/callback', function(req, res, next) {
  spotify_authflow.callback(req, res, next);
});

router.get('/accessToken', function (req, res, next) {
  let db_access_token = db.getToken('access_token');

  let data = {
    'access_token': db_access_token.value
  };
  res.type('application/json');
  res.status(200);
  res.send(data)
});

router.get('/accessExpired', async function (req, res) {

});

router.get('/refreshToken', async function (req, res, next) {
  let name = 'refresh_token';
  if(await db.hasToken(name)){
    let refresh_token = await db.getToken(name);
    console.log('refreshToken: ', refresh_token)
  }
  res.type('application/json');
  res.status(200);
  res.send()
});


module.exports = router;
