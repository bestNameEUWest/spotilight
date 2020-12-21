let db = require('../modules/mongodb_handler');
let _ = require('lodash');
const dns = require('dns');
const os = require('os');


class Esp8266_handler {

    constructor() {
        this.time_delta_ms = 3000;
        this.setWindow();
        this.is_paused = true;
        setInterval(() => {this.timer()}, 10);
        this.is_connected = false;
    }

    connected(){
        return this.is_connected;
    }

    connect(io){
        this.is_connected = true;
        // websocket
        io.on('connection', (socket) => {
            console.log('ESP connected!');
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
            socket.on('ping', (msg) => {
                console.log('message: ' + msg);
                const answer = 'Hello from PC!';
                io.emit('ping', answer);
            });
        });
    }

    setWindow(){
        this.window_start = Date.now();
        this.window_end = this.window_start + this.time_delta_ms;
    }

    timer(){
        if(!this.is_paused){
            /*
            console.log('Window_start, current position and window_end: '
                + (this.window_start - this.position)/1000 + '\t'
                + (Date.now() - this.position)/1000 + '\t'
                + (this.window_end - this.position)/1000);
             */
            if((Date.now() - this.window_start) > this.time_delta_ms) {
                this.setWindow();
                this.sendDataWindow();
            }

        }
    }

    songInfoHandler(song_id, position, is_paused){
        let new_song = this.isNewSong(song_id);

        if(new_song){
            this.newPosition(0);
            this.sendDataWindow();
        } else {
            this.checkPositionDelta(position);
        }
        this.playbackStatus(is_paused);
    }


    isNewSong(song_id){
        if(this.song_id === undefined || this.song_id !== song_id) {
            this.song_id = song_id;
            db.getSong(this.song_id).then(data => {
                this.current_song_data = data;
            });
            return true
        } else {
            return false
        }
    }

    checkPositionDelta(position){
        let relative_position = Date.now() - this.position;
        let needs_adjustment = Math.abs( relative_position - position) > 100;

        if(this.position === undefined || needs_adjustment)
            this.newPosition(position);

        return (Date.now() - this.position - position)/1000;
    }

    newPosition(position){
        this.position = Date.now() - position;
        this.setWindow()
    }

    playbackStatus(is_paused){
        if(this.is_paused !== is_paused) {
            this.is_paused = is_paused;
            if(this.is_paused)
                this.stopPlayback();
            else
                this.startPlayback();
        }
    }


    startPlayback(){
        console.log('start playback')
    }

    stopPlayback(){
        console.log('stop playback')
    }

    sendDataWindow(){
        let assembly = this.assembleDataWindow();
        //console.log(assembly)


    }

    assembleDataWindow(){
        let beats_important = ['start', 'duration'];
        let beats_filter = this.filterForWindow(this.current_song_data.beats);
        let beats_selection = this.getSelectionFor(beats_filter, beats_important);

        let segments_important = ['start', 'duration', 'pitches'];
        let segments_filter = this.filterForWindow(this.current_song_data.segments);
        let segments_selection = this.getSelectionFor(segments_filter, segments_important);

        let assembly = {};
        assembly['beats'] = beats_selection;
        assembly['segments'] = segments_selection;

        return assembly;
    }

    filterForWindow(song_part){
        return _.filter(song_part, (part) => {
            let relative_start = (this.window_start - this.position)/1000;
            let relative_end = (this.window_end - this.position)/1000;
            return (part.start >= relative_start && part.start < relative_end)
        })
    }

    getSelectionFor(json, selection) {
        return _.map(json, function (entry) {
            return _.pick(entry, selection)
        });
    }

}

module.exports = Esp8266_handler;
