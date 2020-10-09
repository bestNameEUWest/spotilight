let lock = false;

function sendRequestTo(endpoint, options) {
    const url = 'http://localhost:3000/player';
    return $.ajax({
        url: url + endpoint,
        method: options.method,
        data: options.params,
    });
}

async function sendPlaystate(state) {
    let endpoint = '/playstate';
    let options = {
        params: {
            paused: state.paused,
            position: state.position,
            song_id: state.track_window.current_track.id
        },
        method: 'GET'
    };

    try {
        await sendRequestTo(endpoint, options)
    } catch (e) {
        throw (e)
    }

}

async function addSong(song) {
    let endpoint = '/songs/' + song.id;
    let options = {
        method: 'POST'
    };
    await sendRequestTo(endpoint, options);
}

async function handleState(state){
    console.log('ID: ' + state.track_window.current_track.id);
    console.log('Position: ' + state.position);
    if(!lock){
        lock = true;
        //console.log(state);
        sendPlaystate(state);

        let current_track = state.track_window.current_track;
        let next_tracks = state.track_window.next_tracks;

        await addSong(current_track);
        next_tracks.forEach(async (next_track) => { await addSong(next_track)});

        lock = false;
    }
}
