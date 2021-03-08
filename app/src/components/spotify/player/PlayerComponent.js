import React, { useState, useEffect, Fragment } from 'react'
import {useSpotifyManager, useSessionState} from '../SpotifyProvider'
import Player from './Player'
import './player.sass'
import { faFingerprint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PlayerCenterButtons from './components/PlayerCenterButtons'
import PlayerDevicesButtons from './components/PlayerDevicesButtons'
import SignInButton from '../SignInButton';

export default function PlayerComponent(){

    const { 
        getAccessToken,
        getCurrentPlayback, 
        getDevices,
        resume,
        pause,
        nextTrack,
        transferPlayback
    } = useSpotifyManager()
    const isLogged = useSessionState()
    const player = new Player(getAccessToken, onStateChange)
    const [devices, setDevices] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    let listener = null

    
    useEffect(() => {
        if (isLogged){
            player.initialize()
                .then(_afterInitPlayer)
                .catch( err => console.error(err))
        }
        else
            player.disconnect()
        return () => {
            player.disconnect()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogged])

    function _afterInitPlayer(device_id){
        getCurrentPlayback()
            .then( currentPlayback => {
                if(currentPlayback){
                    setIsPlaying(currentPlayback.is_playing)
                    if(!currentPlayback.is_playing)
                        _transferPlayer(device_id)
                    else  
                        _refreshDevices()

                }
                else
                    _transferPlayer(device_id)
            })
            .catch( err => console.error(err))
        
        
    }

    function _transferPlayer(_device_id){
        transferPlayback(_device_id)
            .then( () => _refreshDevices() )
            .catch( err => console.error(err) )
    }


    async function setListenerGetCurrenPlayback(){
        if(!listener){
            let _previusDevice = await _listenerFunction(null)
            listener = window.setInterval( () => _listenerFunction(_previusDevice), 5000)
        }
    }

    async function _listenerFunction(_previusDevice){
        getCurrentPlayback()
            .then( currentPlayback => {
                let _currentDevice = currentPlayback.device.name
                if (_currentDevice !== _previusDevice && _previusDevice){
                    _refreshDevices()
                }
                setIsPlaying(currentPlayback.is_playing)
                return _currentDevice
            })
            .catch( () => {
                _clearListenerGetCurrenPlayback()
            })
    }

    function _clearListenerGetCurrenPlayback(){
        if(listener){
            clearInterval(listener)
            listener = null
        }
    }

    async function _refreshDevices(){
        getDevices()
            .then( devices => setDevices(devices))
            .catch( () => player.disconnect())
    }


    async function onStateChange(_actualState){
        if(isLogged) { 
            if(_actualState){
                setIsPlaying(!_actualState.paused)
                _clearListenerGetCurrenPlayback()
                if(listener)
                    _refreshDevices()
            }
            else{
                _refreshDevices()
                setListenerGetCurrenPlayback()      
            }
        }
        else 
            _clearListenerGetCurrenPlayback()
    }

    function _pause(){
        pause()
            .then( () => setIsPlaying(false))
    }

    function _resume(){
        resume()
            .then( () => setIsPlaying(true))
    }

    function _showButtons(){
        return <Fragment>
            <div className="col-4 left">

            </div>

            <div className="col-4 center">
                <PlayerCenterButtons 
                    onResume={_resume}
                    onPause={_pause}
                    onNextTrack={() => nextTrack}
                    isPlaying={isPlaying}
                />
            </div>

            <div className="col-4 right">
                <PlayerDevicesButtons 
                    devices={devices}
                    onTransferPlayback={_transferPlayer}
                />
            </div>
        </Fragment>
    }

    function _showLoadingMessage(){
        return <div className="col-12 loading">
            <FontAwesomeIcon className='logo' icon={faFingerprint}/>
            <p>Loading Player..</p>
        </div>
    }

    function _showSignInButton(){
        return <div className="col-12">
                <SignInButton/>
            </div>
    }

    return (
        <div className='player'>
            <div className="container">
                <div className="row">

                    {(isLogged) 
                        ? (devices)
                            ? _showButtons()
                            : _showLoadingMessage()
                        : _showSignInButton()
                    }

                </div>
            </div>


        </div>
    )
    
}
