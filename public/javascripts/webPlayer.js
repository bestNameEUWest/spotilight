$(async () => {
    const options = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    const tokenEndpoint = 'http://localhost:3000/hasTokens';
    const res = await fetch(tokenEndpoint, options);
    const res_text = await res.json();
    const available = res_text.available;

    if(!available){
        window.location.replace('/login');
    }

    const access_token = res_text.access_token;

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    await $('body').append(script);


    window.onSpotifyWebPlaybackSDKReady = () => {};

    async function waitForSpotifyWebPlaybackSDKToLoad () {
        return new Promise(resolve => {
            if (window.Spotify) {
                resolve(window.Spotify);
            } else {
                window.onSpotifyWebPlaybackSDKReady = () => {
                    resolve(window.Spotify);
                };
            }
        });
    }

    async function waitUntilUserHasSelectedPlayer (sdk) {
        return new Promise(resolve => {
            let interval = setInterval(async () => {
                let state = await sdk.getCurrentState();
                if (state !== null) {
                    resolve(state);
                    clearInterval(interval);
                }
            });
        });
    }

    await (async () => {
        const {Player} = await waitForSpotifyWebPlaybackSDKToLoad();
        const sdk = new Player({
            name: "Spotilight",
            volume: 0.5,
            getOAuthToken: callback => {
                callback(access_token);
            }
        });
        let connect = await sdk.connect();
        if (connect) {
            let url = 'https://api.spotify.com/v1/me/player';
            let options = {
                method: 'put',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                json: true
            };
            sdk.on("player_state_changed", state => {
                handleState(state)
            });
        }
    })();
});



