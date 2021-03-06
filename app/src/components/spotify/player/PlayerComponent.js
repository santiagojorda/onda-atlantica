import React, { useState, useEffect, Fragment } from 'react'
import {useSpotifyManager} from '../SpotifyProvider'
import Player from './Player'
import './player.sass'
import { faFingerprint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PlayerCenterButtons from './components/PlayerCenterButtons'
import PlayerDevicesButtons from './components/PlayerDevicesButtons'

export default function PlayerComponent(){

    const spotyManager = useSpotifyManager()
    const player = new Player(spotyManager, onStateChange)
    const [devices, setDevices] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    let listener = null
    
    useEffect(() => {
        player.initialize()
            .then(_afterInitPlayer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function _afterInitPlayer(_device_id){
        const _currentPlayback = await _getCurrentPlayback()
        
        if(_currentPlayback){
            setIsPlaying(_currentPlayback.is_playing)
            if(!_currentPlayback.is_playing)
                _transferPlayer(_device_id)
            else  
                _refreshDevices()

        }
        else
            _transferPlayer(_device_id)
        
    }

    async function _getCurrentPlayback(){
        return await spotyManager.getCurrentPlayback()
    }


    function _transferPlayer(_device_id){
        spotyManager.transferUserPlayback(_device_id)
            .then( async () => {    
                _refreshDevices()
            })
    }


    async function setListenerGetCurrenPlayback(){
        if(!listener){
            let _previusDevice = await _listenerFunction(null)
            console.log(_previusDevice) 
            listener = window.setInterval( () => _listenerFunction(_previusDevice), 5000)
        }
    }

    async function _listenerFunction(_previusDevice){
        let _currentState = await _getCurrentPlayback()
        let _currentDevice = _currentState.device.name
        if (_currentDevice !== _previusDevice && _previusDevice){
            _refreshDevices()
        }
        setIsPlaying(_currentState.is_playing)
        return _currentDevice
    }

    function _clearListenerGetCurrenPlayback(){
        if(listener){
            clearInterval(listener)
            listener = null
            _refreshDevices()
        }

    }

    async function _refreshDevices(){
        setDevices(await spotyManager.getDevicesInfo())
    }


    async function onStateChange(_actualState){

        if(_actualState){
            setIsPlaying(!_actualState.paused)
            _clearListenerGetCurrenPlayback()
        }
        else{
            _refreshDevices()
            setListenerGetCurrenPlayback()      
        }
    }

    function _pause(){
        setIsPlaying(false)
        spotyManager.pause()
    }

    function _resume(){
        setIsPlaying(true)
        spotyManager.resume()
    }

    function _showButtons(){
        return <Fragment>
            <div className="col-4 left">

            </div>

            <div className="col-4 center">
                <PlayerCenterButtons 
                    onResume={_resume}
                    onPause={_pause}
                    onNextTrack={() => spotyManager.nextTrack()}
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

    return (
        <div className='player'>
            <div className="container">
                <div className="row">

                    {(devices)
                        ? _showButtons()
                        : _showLoadingMessage()
                    }

                </div>
            </div>


        </div>
    )
    
}
