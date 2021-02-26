import {useEffect} from 'react'
import importScript from '../../../common/importScript'
import {useSpotifyManager} from '../SpotifyProvider'
import './player.sass'
const PLAYER_NAME = 'Onda Atlantica'

export default function Player() {

    let webPlaybackInstance = null
    const spotyManager = useSpotifyManager()

    function _initializeWebPlayback(){
      return spotyManager.getAccessToken()
        .then((token)=> {
          webPlaybackInstance = new window.Spotify.Player({
            name: PLAYER_NAME,
            getOAuthToken: callback => {callback(token)},
            volume: 0.5
          });
        })
    }

    function _handlePlayerErrors(){
      webPlaybackInstance.on('initialization_error', ({ message }) => { console.error(message); });
      webPlaybackInstance.on('authentication_error', ({ message }) => { console.error(message); });
      webPlaybackInstance.on('account_error', ({ message }) => { console.error(message); });
      webPlaybackInstance.on('playback_error', ({ message }) => { console.error(message); });
    }

    function _handlePlayerStatusUpdates(){
      webPlaybackInstance.on('player_state_changed', state => { 
        console.log(state);
      });
    }

    function _handlePlayerReady(){
      webPlaybackInstance.on('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id); 
      }); 
    }

    function _handlePlayerConnect(){
      webPlaybackInstance.connect().then( () => {
        console.log('player is connected')
      })
    }

    function _handlePlayerDisconnect(){
      webPlaybackInstance.disconnect().then( () => {
        console.log('player was disconnected')
      })
    }

    function _handleScriptLoad() {
      window.onSpotifyWebPlaybackSDKReady = () => {
          _initializeWebPlayback().then( () => {
            _handlePlayerErrors()
            _handlePlayerStatusUpdates()
            _handlePlayerReady()
            _handlePlayerConnect()
          })
      }
    }
    
    useEffect( () => {
      importScript('https://sdk.scdn.co/spotify-player.js')
        .then( () =>  _handleScriptLoad())
        .catch( err => console.error('mounting spotify player script error: ' + err))
      return () => {
        if(webPlaybackInstance !== null){
          _handlePlayerDisconnect()
          webPlaybackInstance = null
        }
      }
    }, [])


    function _resume() {
        webPlaybackInstance.togglePlay();
    }

    return (
        <div className='player'>
            <div className="container">
              <div className="row align-items-center">
                <div className="col-4">
                  <button onClick={_resume}>play</button>
                </div>
              </div>
            </div>
        </div> 
        
    )
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