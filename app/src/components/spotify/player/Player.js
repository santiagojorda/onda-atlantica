import importScript from '../../../common/importScript'

const PLAYER_NAME = 'Onda Atläntica'

export default class Player {

    constructor(getAccessToken, getChangeDataToComponent){
      this.getAccessToken = getAccessToken
      this.webPlaybackInstance = null
      this.getChangeDataToComponent = getChangeDataToComponent
    }

    initialize(){
      return importScript('https://sdk.scdn.co/spotify-player.js')
        .then( () => this._handleScriptLoad())
    }

    _handleScriptLoad() {
      return new Promise( res => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          this._initializeWebPlayback()
            .then( () => {
              this._handlePlayerErrors()
              this.connect()
              this._handlePlayerStatusUpdates()
              res(this._handlePlayerReady())
            })
        }
      })
    }
    
    _initializeWebPlayback(){
      return this.getAccessToken()
        .then((token)=> {
          this.webPlaybackInstance = new window.Spotify.Player({
            name: PLAYER_NAME,
            getOAuthToken: callback => {callback(token)},
            volume: 1
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
        this.getChangeDataToComponent(state)
      })
    }

    _handlePlayerReady(){
      return new Promise( res => {
        this.webPlaybackInstance.addListener('ready', ({ device_id }) => res(device_id))
      })
    }

    connect(){
      this.webPlaybackInstance.connect()
        .then(success => {
          if (success) {
            console.log('The Web Playback SDK successfully connected to Spotify!');
          }
        })
    }

    disconnect(){
      if(this.webPlaybackInstance){
        console.log('se desconecto')
        this.webPlaybackInstance.pause()
        this.webPlaybackInstance.disconnect()
        this.webPlaybackInstance = null
      }
    }


}

