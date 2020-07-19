require('dotenv').config();
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


let login = function(req, res, next) {
    let client_id = process.env.client_id;
    let redirect_uri = process.env.redirect_uri;

    let stateKey = 'auth_state';
    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    let scope = 'streaming user-read-private user-read-email user-read-playback-state user-modify-playback-state';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        })
    );
};

function refreshToken(req, res) {
    let refresh_token = req.session['refresh_token'];
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

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token;
            res.session('access_token', access_token);
            res.send('');
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

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            let access_token = body.access_token;
            req.session.access_token = access_token;
            let refresh_token = body.refresh_token;
            req.session.refresh_token = refresh_token;

            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            // use the access token to access the Spotify Web API
            request.get(options, function(error, response, body) {
                //console.log(body);
            });

            // we can also pass the token to the browser to make requests from there
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

let callback = function(req, res, next) {
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
