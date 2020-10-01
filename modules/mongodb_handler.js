const mongoose = require('mongoose');
const Token = require('../models/db_Token');
const Song = require('../models/db_Song');

const access_token = 'access_token';
const refresh_token = 'refresh_token';

(async function() {
    const url = 'mongodb://localhost:27017';
    const dbName = '/spotilight';
    mongoose.connect(url+dbName, { useNewUrlParser: true, useUnifiedTopology: true },(err) => {
        if(!err)
            console.log("Connected successfully to server");
        else
            console.log(err)
    });
})();

/**
 * ## INTERNAL FUNCTION ##
 * Deletes specified token from Database
 * @param name: Specified name of your token e.g. 'access_token'
 * @returns {Promise<void>}
 */
async function deleteToken(name){
    try {
        return await Token.deleteOne({ name: name });
    } catch (e) {
        console.log(e.stack);
    }
}

/**
 * ## INTERNAL FUNCTION ##
 * Checks if specified token is saved in database
 * @param name: Specified name of your token e.g. 'refresh_token'
 * @returns {Promise<boolean>}
 */
async function hasToken(name){
    try {
        return await Token.exists({ name: name });
    } catch (e) {
        console.log(e.stack);
        return false;
    }
}

/**
 * ## INTERNAL FUNCTION ##
 * Saves token value, name and expiry date in database
 * @param token: Value of your token
 * @param expires_in: The expiry date of given token
 * @returns {Promise<void>}
 */
async function setToken(token, expires_in){
    if (expires_in > 0) {
        const time = Date.now();
        token.expires_on = time + expires_in;
    }
    const db_token = new Token(token);
    await db_token.save()
}

/**
 * ## INTERNAL FUNCTION ##
 * Gets specified token from database
 * @param name: Specified name of your Token
 * @returns {Promise<null|*>}
 */
async function getToken(name){
    try {
        return (await Token.find({ name: name }))[0];
    } catch (e) {
        console.log(e.stack);
        return null
    }
}

/**
 * Checks for access token
 * @returns {Promise<boolean>}
 */
async function hasAccessToken(){
    return await hasToken(access_token);
}

/**
 * Returns access token from database
 * @returns {Promise<boolean>}
 */
async function getAccessToken(){
    return await getToken(access_token);
}

/**
 * Saves access token in database
 * @returns {Promise<void>}
 */
async function setAccessToken(token, expires_in){
    token.name = access_token;
    return await setToken(token, expires_in);
}

/**
 * Deletes access token from database
 * @returns {Promise<void>}
 */
async function deleteAccessToken(){
    return await deleteToken(access_token);
}


/**
 * Checks for refresh token
 * @returns {Promise<boolean>}
 */
async function hasRefreshToken(){
    return await hasToken(refresh_token);
}

/**
 * Returns refresh token from database
 * @returns {Promise<boolean>}
 */
async function getRefreshToken(){
    return await getToken(refresh_token);
}

/**
 * Saves refresh token in database
 * @returns {Promise<void>}
 */
async function setRefreshToken(token){
    token.name = refresh_token;
    return await setToken(token, 0);
}

/**
 * Deletes refresh token from database
 * @returns {Promise<void>}
 */
async function deleteRefreshToken(){
    return await deleteToken(refresh_token);
}

async function addSong(song) {
    try {
        const db_song = new Song(song);
        await db_song.save()
    } catch (e) {
        console.log(e.stack)
    }

}

async function getSong(id) {
    try {
        return (await Song.find({ id: id }))[0];
    } catch (e) {
        console.log(e.stack)
    }
}

async function hasSong(id) {
    if(this.lock === undefined)
        this.lock = false;

    if(this.lock){
        this.lock = true;
        try {
            let has_song = await Song.exists({ id: id });
            console.log('has song: ' + has_song);
            return has_song; // await Song.exists({ id: id });
        } catch (e) {
            console.log(e.stack);
            return null
        } finally {
            this.lock = false;
        }
    }

}

module.exports.hasAccessToken = hasAccessToken;
module.exports.getAccessToken = getAccessToken;
module.exports.setAccessToken = setAccessToken;
module.exports.deleteAccessToken = deleteAccessToken;

module.exports.hasRefreshToken = hasRefreshToken;
module.exports.getRefreshToken = getRefreshToken;
module.exports.setRefreshToken = setRefreshToken;
module.exports.deleteRefreshToken = deleteRefreshToken;


module.exports.hasSong = hasSong;
module.exports.addSong = addSong;
module.exports.getSong = getSong;
