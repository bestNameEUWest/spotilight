const mongoose = require('mongoose');
const assert = require('assert');
const Token = require('../models/db_Token');
const Song = require('../models/db_Song');

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

async function deleteToken(name){
    try {
        return await Token.deleteOne({ name: name });
    } catch (e) {
        console.log(e.stack);
    }
}

async function hasToken(name){
    try {
        return await Token.exists({ name: name });
    } catch (e) {
        console.log(e.stack);
        return false;
    }
}

async function setToken(token, expires_in=0){
    if (expires_in > 0) {
        const time = Date.now();
        token.expires_on = time + expires_in;
    }
    const db_token = new Token(token);
    await db_token.save()
}

async function getToken(name){
    try {
        return (await Token.find({ name: name }))[0];
    } catch (e) {
        console.log(e.stack);
        return null
    }
}

async function addSong(song) {
    try {

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
    try {
        return await Song.exists({ id: id });
    } catch (e) {
        console.log(e.stack)
    }
}

module.exports.hasToken = hasToken;
module.exports.setToken = setToken;
module.exports.getToken = getToken;
module.exports.deleteToken = deleteToken;

module.exports.hasSong = hasSong;
module.exports.addSong = addSong;
module.exports.getSong = getSong;
