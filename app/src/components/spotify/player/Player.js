import importScript from '../../../common/importScript'

const PLAYER_NAME = 'Onda Atlantica'

export default class Player {

    constructor(spotyManager, getChangeDataToComponent, afterInitPlayer){
      this.spotyManager = spotyManager
      this.webPlaybackInstance = null
      this.getChangeDataToComponent = getChangeDataToComponent
      this.afterInitPlayer = afterInitPlayer 
    }

    initialize(){
      importScript('https://sdk.scdn.co/spotify-player.js')
        .then( () => this._handleScriptLoad())
    }

    _handleScriptLoad() {
        window.onSpotifyWebPlaybackSDKReady = () => {
          this._initializeWebPlayback()
              .then( () => {
                this._handlePlayerErrors()
                this.webPlaybackInstance.connect()
                this._handlePlayerReady()
                this._handlePlayerStatusUpdates()
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
    }

    _handlePlayerErrors(){
      this.webPlaybackInstance.on('initialization_error', ({ message }) => { console.error(message); });
      this.webPlaybackInstance.on('authentication_error', ({ message }) => { console.error(message); });
      this.webPlaybackInstance.on('account_error', ({ message }) => { console.error(message); });
      this.webPlaybackInstance.on('playback_error', ({ message }) => { console.error(message); });
    }

    _handlePlayerStatusUpdates(){
      this.webPlaybackInstance.addListener('player_state_changed', state => { 
        console.log(state)
        this.getChangeDataToComponent(state)
      })
    }

    _handlePlayerReady(){
      this.webPlaybackInstance.on('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id); 
        this.afterInitPlayer(device_id)
        // this.getDevicesInfo(device_id)

        // console.log('first pause')
        // this.spotyManager.pause()
      })
    }

    connect(){
      this.webPlaybackInstance.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      })
    }

    disconnect(){
      this.webPlaybackInstance.disconnect()
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

