let db = require('../modules/mongodb_handler');

class Player_imitator {

  constructor(songEvent) {
    this.songEvent = songEvent;
    this.time_delta_ms = 3000;
    this.setWindow();
    this.is_paused = true;
    setInterval(() => {
      if(!this.is_paused && this.current_song_data !== null){
        this.timer();
      }
    }, 10);

  }

  setWindow(){
    this.window_start = Date.now();
    this.window_end = this.window_start + this.time_delta_ms;
  }

  timer(){
    if((Date.now() - this.window_start) > this.time_delta_ms) {
      this.setWindow();
      this.emitSongEvent();
    }
  }

  async songInfoHandler(song_id, position, is_paused){
    await this.updateSong(song_id);
    //console.log(`DEBUG song data: ${this.current_song_data.beats[0]}`);
    //console.log(`DEBUG current id: ${this.song_id}`);
    //console.log(`DEBUG next id: ${song_id}`);
    this.updateStartPosition(position);
    this.is_paused = is_paused;
    this.emitSongEvent();
  }


  async updateSong(song_id){
    if(this.song_id === undefined || this.song_id !== song_id) {
      this.song_id = song_id;

      await db.getSong(this.song_id).then(data => {
        this.current_song_data = data;
      });
    }
  }

  updateStartPosition(position){
    this.start_position = Date.now() - position;
    this.setWindow()
  }

  emitSongEvent(){
    let window = {
      start: (this.window_start - this.start_position)/1000,
      end: (this.window_end - this.start_position)/1000,
    };
    this.songEvent.processInfo(this.current_song_data, window, this.is_paused);
  }
}

module.exports = Player_imitator;
