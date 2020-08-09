async function sendRequestTo(endpoint, options) {
    const url = 'http://localhost:3000/player';
    let res = await $.ajax({
        url: url + endpoint,
        method: options.method,
        data: options.params,
    });
    return res
}

function sendPlaystate(state) {
    let endpoint = '/playstate';
    let options = {
        params: {
            paused: state.paused,
            position: state.position
        },
        method: 'GET'
    };

    sendRequestTo(endpoint, options)
}

async function hasSong(song) {
    let endpoint = '/songs/' + song.id;
    let options = {
        method: 'GET'
    };
    let res = await sendRequestTo(endpoint, options);
    console.log(res.statusCode)
}

async function addSong(song) {
    let endpoint = '/songs';
    let options = {
        params: {
            song: song
        },
        method: 'POST'
    };
    let res = sendRequestTo(endpoint, options);
    console.log(res)
}

function handleState(state){
    console.log(state);
    sendPlaystate(state);

    let current_track = state.track_window.current_track;
    let next_tracks = state.track_window.next_tracks;

    let songs = [];
    songs.push(current_track);
    next_tracks.forEach(next_track => { songs.push(next_track); });

    songs.forEach(song => {
        hasSong(song)
    });

    //sendSongs(songs);
}
