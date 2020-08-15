var express = require('express');
var router = express.Router();
let db = require('../modules/mongodb_handler');

let spotify_authflow = require('../modules/spotify_authflow');



router.get('/hasTokens', async function (req, res, next) {
  let db_access_token = await db.getToken('access_token');
  let refresh_token = await db.getToken('refresh_token');
  let data = {
    available: true,
    access_token: ''
  };
  if(db_access_token === undefined || refresh_token === undefined){
    data.available = false;
  } else {
    let is_valid = db_access_token.expires_on > Date.now();
    if(!is_valid){
      await spotify_authflow.refreshToken();
      db_access_token = await db.getToken('access_token');
    }
    data.access_token = db_access_token.value;
  }
  res.type('application/json');
  res.status(200);
  res.send(data)
});


router.get('/login', async function (req, res, next) {
  return spotify_authflow.login(req, res, next);
});


router.get('/callback', function(req, res, next) {
  spotify_authflow.callback(req, res, next);
});


router.get('/deleteTokens', async function (req, res) {
  await db.deleteToken('access_token');
  await db.deleteToken('refresh_token');
  res.status(200);
  res.redirect('/#');
});



module.exports = router;
