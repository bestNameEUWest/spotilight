async function sendRequestTo(endpoint, params, rest_method) {
    const url = 'http://localhost:3000/player';
    await $.ajax({
        url: url + endpoint,
        method: rest_method,
        data: params,
    });
}

function sendPlaystate(state) {
    let endpoint = '/playstate';
    let params = {
        paused: state.paused,
        position: state.position
    };
    sendRequestTo(endpoint, params)
}
