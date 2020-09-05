const Song = require('../models/db_Song');
const request = require('request');
let db = require('../modules/mongodb_handler');
let _ = require('lodash');

const version = '1';

async function getSelectionFor(json, selection) {
    return await _.map(json, function(entry) {
        return _.pick(entry, selection)
    });
}


async function getAudioAnalysisForSongID(id) {
    let url = 'https://api.spotify.com/v1/audio-analysis/';
    let access_token = (await db.getAccessToken()).value;
    let options = {
        url: url + id,
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    };

    await request.get(options, async function (error, res, body) {
        let song = new Song();
        song.id = id;
        song.version = version;

        let bars_selection = ['start', 'duration'];
        song.bars = await getSelectionFor(body.bars, bars_selection);

        let beats_selection = ['start', 'duration'];
        song.beats = await getSelectionFor(body.beats, beats_selection);

        let sections_selection = ['start', 'duration', 'loudness', 'tempo', 'key'];
        song.sections = await getSelectionFor(body.sections, sections_selection);

        let segments_selection = ['start', 'duration', 'loudness_start', 'pitches', 'timbre'];
        song.segments = await getSelectionFor(body.segments, segments_selection);
    })
}


module.exports.getAudioAnalysisForSongID = getAudioAnalysisForSongID;
