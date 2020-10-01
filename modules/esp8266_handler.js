let db = require('../modules/mongodb_handler');

class Esp8266_handler {

    constructor() {
        this.time_delta_ms = 5000;
        this.intervall = setInterval(() => {this.statusObserver()}, 1);
    }

    setSongID(song_id){
        this.song_id = song_id
    }

    setPaused(isPlaying){
        this.is_paused = isPlaying;
    }

    setPosition(position){
        this.position = Date.now() - position;
    }

    statusObserver(){
        if(!this.is_paused){
            //console.log('Current position: ' + (Date.now() - this.position)/1000);
        }
        //console.log('Current song id: ' + this.song_id);

        //console.log('Current paused: ' + this.is_paused);
    }


    /*sendDataFrom(time_in_ms = 0){
        const offset = Date.now() - time_in_ms;
        this.intervall = setInterval(this.timerTest.bind(null, offset), 1000)
    }

    stopData(){
        if(this.intervall !== undefined) {
            clearInterval(this.intervall)
        }
    }
    */



}

module.exports = Esp8266_handler;
