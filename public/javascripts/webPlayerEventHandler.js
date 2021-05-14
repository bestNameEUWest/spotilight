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

        let current_track = state.track_window.current_track;
        let next_tracks = state.track_window.next_tracks;

        await addSong(current_track);
        next_tracks.forEach(async (next_track) => { await addSong(next_track)});

        sendPlaystate(state);

        lock = false;
    }
}

async function changeToPlayer(device_id, access_token) {
    let url = 'https://api.spotify.com/v1/me/player';
    let options = {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        data: JSON.stringify({
            device_ids: [device_id],
            play: true
        }),
    };
    try {
        await $.ajax(url, options);
    } catch (e) {
        console.log(e)
    }

}
