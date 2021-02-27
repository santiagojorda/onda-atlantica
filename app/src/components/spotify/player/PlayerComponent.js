import React, { useState, useEffect } from 'react'
import {useSpotifyManager} from '../SpotifyProvider'
import Player from './Player'
import './player.sass'


export default function PlayerComponent(){

    const [spotyManager,] = useState(useSpotifyManager())
    const [player,] = useState(new Player(spotyManager))

    useEffect(() => {
        player.initialize()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className='player'>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-4"></div>
                    
                    <div className="col-4">
                        {/* <button className='resume-btn' onClick={resume}> boton </button> */}
                    </div>
                    
                    <div className="col-4"></div>
                </div>
            </div>
        </div>
    )
    
}
