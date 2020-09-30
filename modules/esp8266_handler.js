let db = require('../modules/mongodb_handler');

class Esp8266_handler {
    intervall;
    current_song = '2FL785nGQsw1oaYwM1j6Eh';

    constructor() {
    }

    timerTest(start_time){
        let passed_time = Date.now() - start_time
        console.log('Current passed time: ' + passed_time)
        console.log('Current song id: ' + this.current_song)
    }

    sendDataFrom(time_in_ms = 0){
        const offset = Date.now() - time_in_ms
        this.intervall = setInterval(this.timerTest.bind(null, offset), 1000)
    }

    stopData(){
        if(this.intervall !== undefined) {
            clearInterval(this.intervall)
        }
    }

    setCurrentSong(song_id){
        this.current_song = song_id
    }


}

module.exports.ESPHandler = Esp8266_handler