const request = require('request');
let db = require('../modules/mongodb_handler');
let _ = require('lodash');

const version = '1';

function getSelectionFor(json, selection) {
    return _.map(json, function (entry) {
        return _.pick(entry, selection)
    });
}

async function getAudioAnalysisForATrack(id) {
    let url = 'https://api.spotify.com/v1/audio-analysis/';
    let access_token = (await db.getAccessToken()).value;
    let options = {
        url: url + id,
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    };

    return new Promise(function (resolve, reject) {
        request.get(options, async function (error, res, body) {
            if(!error && res.statusCode === 200) {
                resolve(await parseAudioAnalysis(body, id))
            } else {
                reject(error)
            }
        })
    })
}

async function parseAudioAnalysis(body, id) {
    let song = {};
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

    return song
}

async function getAudioAnalysis(id) {
    return await getAudioAnalysisForATrack(id);
}

module.exports.getAudioAnalysis = getAudioAnalysis;
