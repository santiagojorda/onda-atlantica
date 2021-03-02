import React, { useState, useEffect } from 'react'
import {useSpotifyManager} from '../SpotifyProvider'
import Player from './Player'
import './player.sass'

import PlayerCenterButtons from './components/PlayerCenterButtons'

export default function PlayerComponent(){

    const [spotyManager,] = useState(useSpotifyManager())
    const [player,] = useState(new Player(spotyManager, onStateChange))
    const [actualState, setActualState] = useState(null)
    
    useEffect(() => {
        player.initialize()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function onStateChange(_actualState){
        setActualState(_actualState)
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
                            // onMute={(vol) => player.setVolume(vol)}
                            onResume={() => player.resume()}
                            onPause={() => player.pause()}
                            onNextTrack={() => player.nextTrack()}   
                        />
                    </div>

                    <div className="col-4 right">

                    </div>

                </div>
            </div>


        </div>
    )
    
}
