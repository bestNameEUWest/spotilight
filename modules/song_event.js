let _ = require('lodash');

function processInfo(song_data, window, is_paused) {
  let assembly = assembleDataWindow(song_data, window);
  //console.log(`assembly data id: ${data._id}`)
  this.espHandler.sendData(assembly);
}


function assembleDataWindow(song_data, window){
  let beats_important = ['start', 'duration'];
  let beats_filter = filterForWindow(song_data.beats, window);
  let beats_selection = getSelectionFor(beats_filter, beats_important);

  let segments_important = ['start', 'duration', 'pitches'];
  let segments_filter = filterForWindow(song_data.segments, window);
  let segments_selection = getSelectionFor(segments_filter, segments_important);

  let assembly = {};
  assembly['beats'] = beats_selection;
  assembly['segments'] = segments_selection;

  return assembly;
}

function filterForWindow(song_part, window){
  return _.filter(song_part, (part) => {
    return (part.start >= window.start && part.start < window.end)
  })
}

function getSelectionFor(json, selection) {
  return _.map(json, function (entry) {
    return _.pick(entry, selection)
  });
}

function addEspHandler(callback){
  this.espHandler = callback;
}

module.exports.processInfo = processInfo;
module.exports.addEspHandler = addEspHandler;
