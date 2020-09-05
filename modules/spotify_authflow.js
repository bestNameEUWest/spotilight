require('dotenv').config();
let db = require('../modules/mongodb_handler');
let querystring = require('querystring');
let request = require('request');

let generateRandomString = function(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

async function tokenHandler(body){
    let access_token = body.access_token;
    let expires_in = body.expires_in;
    await db.deleteAccessToken();
    await db.setAccessToken({ value: access_token }, expires_in);

    let refresh_token = body.refresh_token;
    if(refresh_token !== undefined){
        await db.deleteRefreshToken();
        await db.setRefreshToken({ value: refresh_token });
    }
}


let login = function(req, res) {
    let client_id = process.env.client_id;
    let redirect_uri = process.env.redirect_uri;

    let stateKey = 'auth_state';
    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    let scope = 'streaming user-read-private user-read-email user-read-playback-state user-modify-playback-state';

    return res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        })
    );
};

async function refreshToken() {
    let refresh_token = (await db.getRefreshToken()).value;
    let client_id = process.env.client_id;
    let client_secret = process.env.client_secret;
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, async function(error, response, body) {
        if (!error && response.statusCode === 200) {
            await tokenHandler(body);
        }
    });
}

function requestTokens(req, res) {
    let redirect_uri = process.env.redirect_uri;
    let client_id = process.env.client_id;
    let client_secret = process.env.client_secret;
    let code = req.query.code || null;

    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, async function(error, response, body) {
        if (!error && response.statusCode === 200) {
            await tokenHandler(body);
            res.redirect('/#');
        } else {
            res.redirect('/#' +
                querystring.stringify({
                    error: 'invalid_token'
                })
            );
        }
    });
}

let callback = function(req, res) {
    let stateKey = 'auth_state';
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('http://localhost:3000/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        requestTokens(req, res)
    }
};

module.exports.login = login;
module.exports.callback = callback;
module.exports.refreshToken = refreshToken;
