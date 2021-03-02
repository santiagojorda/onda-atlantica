import importScript from '../../../common/importScript'

const PLAYER_NAME = 'Onda Atlantica'

export default class Player {

    constructor(spotyManager, getChangeDataToComponent){
      this.spotyManager = spotyManager
      this.webPlaybackInstance = null
      this.getChangeDataToComponent = getChangeDataToComponent
    }

    initialize(){
      importScript('https://sdk.scdn.co/spotify-player.js')
        .then( () => this._handleScriptLoad())
        .catch( err => console.error(err))
    }

    _handleScriptLoad() {
      window.onSpotifyWebPlaybackSDKReady = () => {
        this._initializeWebPlayback()
            .then( () => {
              this._handlePlayerErrors()
              this._handlePlayerStatusUpdates()
              this._handlePlayerReady()
              this._handlePlayerConnect()
            })
      }
    }

    _initializeWebPlayback(){
      return this.spotyManager
        .getAccessToken()
        .then((token)=> {
          this.webPlaybackInstance = new window.Spotify.Player({
            name: PLAYER_NAME,
            getOAuthToken: callback => {callback(token)},
            volume: 0.5
          })
        })
        .catch( err => {
          console.error('There was an error getting an Access Token when Spotify Player was initialized: ' + err)
        })
    }

    _handlePlayerErrors(){
      this.webPlaybackInstance.on('initialization_error', ({ message }) => { console.error(message); });
      this.webPlaybackInstance.on('authentication_error', ({ message }) => { console.error(message); });
      this.webPlaybackInstance.on('account_error', ({ message }) => { console.error(message); });
      this.webPlaybackInstance.on('playback_error', ({ message }) => { console.error(message); });
    }

    _handlePlayerStatusUpdates(){
      this.webPlaybackInstance.addListener('player_state_changed', state => { 
        this.getChangeDataToComponent(state)
      })
    }

    _handlePlayerReady(){
      this.webPlaybackInstance.on('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id); 
      })
    }

    _handlePlayerConnect(){
      this.webPlaybackInstance.connect().then( () => {
        console.log('player is connected')
      })
    }


    resume(){
      this.webPlaybackInstance.resume()
        .then(() => {
          console.log('Resumed!');
        })
    }

    pause(){
      this.webPlaybackInstance.pause()
        .then(() => {
          console.log('paused!');
        })
    }

    nextTrack(){
      this.webPlaybackInstance.nextTrack().then(() => {
        console.log('Skipped to next track!');
      });
    }

}

