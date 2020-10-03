let lock = false;

async function sendRequestTo(endpoint, options) {
    const url = 'http://localhost:3000/player';
    return $.ajax({
        url: url + endpoint,
        method: options.method,
        data: options.params,
    });
}

function sendPlaystate(state) {
    let endpoint = '/playstate';
    let options = {
        params: {
            paused: state.paused,
            position: state.position,
            song_id: state.track_window.current_track.id
        },
        method: 'GET'
    };

    sendRequestTo(endpoint, options)
}

async function RESTCallSong(song, method){
    let endpoint = '/songs/' + song.id;
    let options = {
        method: method
    };
    await sendRequestTo(endpoint, options);
}

async function hasSong(song) {
    const method = 'GET';
    try {
        await RESTCallSong(song, method);
    } catch (e) {
        throw e
    }

}

async function addSong(song) {
    const method = 'POST';
    try {
        await RESTCallSong(song, method);
    } catch (e) {
        throw e
    }

}

async function handleState(state){
    if(!lock){
        lock = true;
        //console.log(state);
        sendPlaystate(state);

        let current_track = state.track_window.current_track;
        let next_tracks = state.track_window.next_tracks;

        let songs = [];
        songs.push(current_track);
        next_tracks.forEach(next_track => { songs.push(next_track); });

        songs.forEach(async function(song){
            try {
                await hasSong(song)
            } catch (e) {
                if(e.status === 404){
                    console.log('addSong')
                    await addSong(song);
                }
            }
        });
        lock = false;
    }
}
