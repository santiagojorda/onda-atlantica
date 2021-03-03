import React, { useState, useEffect } from 'react'
import {useSpotifyManager} from '../SpotifyProvider'
import Player from './Player'
import './player.sass'

import PlayerCenterButtons from './components/PlayerCenterButtons'

export default function PlayerComponent(){

    const [spotyManager,] = useState(useSpotifyManager())
    const [player,] = useState(new Player(spotyManager, onStateChange, _afterInitPlayer))
    const [actualState, setActualState] = useState(null)
    const [devices, setDevices] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    let interval = null
    
    useEffect(() => {
        player.initialize()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function _afterInitPlayer(_device_id){
        setIntervalGetStatus()
        const _currentPlayback = await spotyManager.getCurrentPlayback()
        // console.log(_currentPlayback)
        if(_currentPlayback != undefined){
            setIsPlaying(_currentPlayback.is_playing)
            console.log('when player component init, spotify is playing: ' + _currentPlayback.is_playing)
            if(!_currentPlayback.is_playing){
                console.log('as Spotify playback is not playing, playback is transferred to the SDK Player')
                _transferPlayer(_device_id)
            }
            else{
                const _devicesInfo = await spotyManager.getDevicesInfo()
                console.log('----- device Info post transfer')
                console.log(_devicesInfo)
                setDevices(_devicesInfo)
            }
        }
        else{
            console.log('as there is not a active playback. playback is transferred to the SDK Player')
            _transferPlayer(_device_id)
        }
    }


    function _transferPlayer(_device_id){
        spotyManager.transferUserPlayback(_device_id)
        .then( async () => {    
            const _devicesInfo = await spotyManager.getDevicesInfo()
            console.log('----- device Info post transfer')
            console.log(_devicesInfo)
            setDevices(_devicesInfo)
        })
    }

    async function checkIfItsPlaying(_actualState){
        console.log('checking if spotify is playing')
        if(_actualState === null){
            let _is_playing = await spotyManager.getCurrentPlayback().is_playing
            setIsPlaying(_is_playing)
            return _is_playing
        }
        if(_actualState.paused){
            setIsPlaying(false)
            return false
        }
        setIsPlaying(true)
        return true
    }

    function setIntervalGetStatus(){
        interval = window.setInterval( async () => {
            let _current = await spotyManager.getCurrentPlayback()
            setIsPlaying(_current.is_playing)
        }, 2000)
    }

    async function onStateChange(_actualState){
        checkIfItsPlaying(_actualState)
        if(_actualState === null){
            setDevices( await spotyManager.getDevicesInfo())
            if(interval === null){
                setIntervalGetStatus(interval)
            }
        }
        else{
            if(interval !== null){
                clearInterval(interval)
                interval = null
            }
        }

        setActualState(_actualState)
    }

    // async function getDevicesInfo(_device_id){
    //     setDevices(await spotyManager.getDevicesInfo())
    //     spotyManager.setLastPlaylist(_device_id)
    // }

    return (
        <div className='player'>
            <div className="container">
                <div className="row">

                    <div className="col-4 left">

                    </div>
                    
                    <div className="col-4 center">
                        <PlayerCenterButtons 
                            actualState={actualState}
                            // onMute={(vol) => player.setVolume(vol)}
                            onResume={() => {
                                    setIsPlaying(true)
                                    spotyManager.resume()
                                }
                            }
                            onPause={ () => {
                                    setIsPlaying(false)
                                    spotyManager.pause()
                                }
                            }
                            onNextTrack={() => spotyManager.nextTrack()}
                            isPlaying={isPlaying}
                        />
                    </div>

                    <div className="col-4 right">
                        {(devices !== null) 
                            ? devices.map((device, i) => {
                                return <p key={i} style={ (device.is_active) ? {color:'red'} : {} } onClick={()=>_transferPlayer(device.id)}>{device.name}</p>
                                
                            })
                            : <p>No devices connected</p>
                        }
                    </div>

                </div>
            </div>


        </div>
    )
    
}
