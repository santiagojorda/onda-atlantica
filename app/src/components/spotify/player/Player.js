import importScript from '../../../common/importScript'

const PLAYER_NAME = 'Onda Atlantica'

export default class Player {

    constructor(spotyManager){
      this.spotyManager = spotyManager
      this.webPlaybackInstance = null
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
      this.webPlaybackInstance.on('player_state_changed', state => { 
        console.log(state);
      });
    }

    _handlePlayerReady(){
      this.webPlaybackInstance.on('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id); 
      }); 
    }

    _handlePlayerConnect(){
      this.webPlaybackInstance.connect().then( () => {
        console.log('player is connected')
      })
    }

    // function _handlePlayerDisconnect(){
    //   webPlaybackInstance.disconnect().then( () => {
    //     console.log('player was disconnected')
    //   })
    // }


    
    // useEffect( () => {
    //   return () => {
    //     if(webPlaybackInstance !== null){
    //       _handlePlayerDisconnect()
    //       // eslint-disable-next-line react-hooks/exhaustive-deps
    //       webPlaybackInstance = null
    //     }
    //   }
    // }, [])

    // let isPlaying = false

    

    // function renderButtonResume() {
    //     isPlaying = !isPlaying
    //     webPlaybackInstance.togglePlay();
    //     if(isPlaying)
    //       return <FontAwesomeIcon icon={faPause} />
    //     return <FontAwesomeIcon icon={faPlay} />
    // }

}


                // const play = ({
                //   spotify_uri,
                //   playerInstance: {
                //     _options: {
                //       getOAuthToken,
                //       id
                //     }
                //   }
                // }) => {
                //   getOAuthToken(access_token => {
                //     fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
                //       method: 'PUT',
                //       // body: JSON.stringify({ uris: [spotify_uri] }),
                //       headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': `Bearer ${access_token}`
                //       },
                //     });
                //   });
                // };
          
                // play({
                //   playerInstance: webPlaybackInstance,
                //   spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
                // });