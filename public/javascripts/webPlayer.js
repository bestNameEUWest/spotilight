$(async () => {
    const options = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    const tokenEndpoint = 'http://localhost:3000/accessToken';
    const res = await fetch(tokenEndpoint, options);
    const res_text = await res.json();
    let access_token = res_text.access_token;

    if(access_token === undefined){
        console.log('is undefined');
        const tokenEndpoint = 'http://localhost:3000/refreshToken';
        const res = await fetch(tokenEndpoint, options);
        const res_text = await res.json();
        access_token = res_text.access_token;
        console.log(access_token)
    } else {

    }

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

    (async () => {
        const { Player } = await waitForSpotifyWebPlaybackSDKToLoad();
        const sdk = new Player({
            name: "Web Playback SDK",
            volume: 1.0,
            getOAuthToken: callback => { callback(access_token); }
        });

        sdk.on("player_state_changed", state => {
            handleState(state)
        });
    })();
});



