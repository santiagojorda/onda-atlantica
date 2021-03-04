import React, { useState, useEffect } from 'react'
import {useSpotifyManager} from '../SpotifyProvider'
import Player from './Player'
import './player.sass'

import PlayerCenterButtons from './components/PlayerCenterButtons'
import PlayerDevicesButtons from './components/PlayerDevicesButtons'

export default function PlayerComponent(){

    const spotyManager = useSpotifyManager()
    const player = new Player(spotyManager, onStateChange, _afterInitPlayer)
    const [actualState, setActualState] = useState(null)
    const [devices, setDevices] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    let interval = null
    
    useEffect(() => {
        player.initialize()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function _afterInitPlayer(_device_id){
        const _currentPlayback = await spotyManager.getCurrentPlayback()
        
        if(_currentPlayback !== undefined){
            setIsPlaying(_currentPlayback.is_playing)
            if(!_currentPlayback.is_playing)
                _transferPlayer(_device_id)
            else  
                _refreshDevices()

        }
        else
            _transferPlayer(_device_id)
        
    }


    function _transferPlayer(_device_id){
        spotyManager.transferUserPlayback(_device_id)
            .then( async () => {    
                _refreshDevices()
            })
    }


    function setIntervalGetCurrenPlayback(){
        const _secondsOfInterval = 5
        interval = window.setInterval( async () => {
            let _current = await spotyManager.getCurrentPlayback()
            setIsPlaying(_current.is_playing)
        }, _secondsOfInterval * 1000)
    }

    function _clearIntervalGetCurrenPlayback(){
        clearInterval()
        interval = null
    }

    async function _refreshDevices(){
        const _devices = await spotyManager.getDevicesInfo()
        setDevices(_devices)
    }


    function _setPlayingState(_actualState){
        if(_actualState.paused)
            setIsPlaying(false)
        else 
            setIsPlaying(true)
    }

    function _intervalIsActive (){
        return (interval === null)
    }

    async function onStateChange(_actualState){

        if(_actualState === null){
            _refreshDevices()
            if(_intervalIsActive())
                setIntervalGetCurrenPlayback()
        }
        else{
            _setPlayingState(_actualState)
            if(!_intervalIsActive()){
                _refreshDevices()
                _clearIntervalGetCurrenPlayback()
            }        
        }
        setActualState(_actualState)
    }

    function _pause(){
        setIsPlaying(false)
        spotyManager.pause()
    }

    function _resume(){
        setIsPlaying(true)
        spotyManager.resume()
    }

    return (
        <div className='player'>
            <div className="container">
                <div className="row">

                    <div className="col-4 left">

                    </div>
                    
                    <div className="col-4 center">
                        <PlayerCenterButtons 
                            actualState={actualState}
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

                </div>
            </div>


        </div>
    )
    
}
