import React, { useState, useEffect } from 'react'
import {useSpotifyManager} from '../SpotifyProvider'
import Player from './Player'
import './player.sass'


export default function PlayerComponent(){

    const [spotyManager,] = useState(useSpotifyManager())
    const [player,] = useState(new Player(spotyManager, onStateChange))
    const [isPlaying, setIsPlaying] = useState(false)
    const [actualState, setActualState] = useState(true) 

    
    useEffect(() => {
        player.initialize()
    }, [])

    function onStateChange(_actualState){
        setActualState(_actualState)
        setIsPlaying(!_actualState.paused)
    }

    function _onClick() {
        if(isPlaying)
            player.pause()
        else
            player.resume()
        setIsPlaying(!isPlaying)
    }

    function _renderButton(text){
        return <h1 onClick={_onClick}>{text}</h1>
    }

    return (
        <div className='player'>
            {isPlaying 
                ? _renderButton('pause')
                : _renderButton('resume')
            }
        </div>
    )
    
}
