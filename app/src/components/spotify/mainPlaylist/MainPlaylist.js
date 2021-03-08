import React, { useState, useEffect } from 'react'
import {useSpotifyManager,useSessionState} from '../SpotifyProvider'
import mainPlaylistCover from '../../../images/covers/main-playlist2.jpg'
import './mainPlaylist.sass'
import SignInButton from '../SignInButton'

import { faFingerprint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const MAIN_PLAYLIST_ID = '2HEJBPwHCrWlvd9s4r2Nte'
const MAIN_PLAYLIST_URI = 'spotify:playlist:'+MAIN_PLAYLIST_ID
const THERE_IS_NO_ACTIVE_ITEM = -1

export default function MainPlaylist() {

    const {getPlaylist, setCurrentTrack } = useSpotifyManager()
    const isLogged = useSessionState()
    const [actualPlaylist, setActualPlaylist] = useState(null)
    const [activeItem, setItemActive] = useState(THERE_IS_NO_ACTIVE_ITEM)

    useEffect(() => {
        if (isLogged)
            _getMainPlaylist(MAIN_PLAYLIST_ID)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function _setTracksToActualPlaylist(_playlist){
        setActualPlaylist(_playlist.items)
    }

    async function _getMainPlaylist(_playlist_id){
        getPlaylist(_playlist_id)
            .then( resp => _setTracksToActualPlaylist(resp))
            .catch( err => console.error(err))
    } 

    function _renderActiveTrackContainer(_item, _pos){
        return <div key={_pos} className="active-item shadow border">
            <img src={_item.track.album.images[2].url} alt=""/>

            <div className="circle">
                <p className='position'>{_pos+1}</p>
            </div>
            <div className="info">
                <p className='title'>{_item.track.name}</p>
                <p className='artist'>{_item.track.artists[0].name}</p>
            </div>
        </div>
    }

    function _renderListItem(_item, _pos){
        return <div key={_pos} className='no-active-item'>
            <p className='position'>{_pos+1}</p>
            <div className="info">
                <p className='title'>{_item.track.name}</p>
                <p className='artist'>{_item.track.artists[0].name}</p>
            </div>
        </div>
    }

    function _trackOnClick(pos){
        setCurrentTrack(MAIN_PLAYLIST_URI, pos)
            .then( () => setItemActive(pos) )
            .catch( err => console.error(err) )
    }

    function _renderTracks(){
        return (
            <ol className='track-list'>
                {actualPlaylist.map( (_item, _pos) => {

                    return <div className='item' key={_pos} onClick={() => _trackOnClick(_pos)}>
                        {(_pos === activeItem)
                            ? _renderActiveTrackContainer(_item, _pos)
                            : _renderListItem(_item, _pos)
                        }
                    </div>
                })}
            </ol>

        )
    }

    function _showSignIn() {
        return <div className='d-flex justify-content-center align-items-center h-100'>
                <SignInButton />
            </div>
    }

    return (
        <div className="main-playlist">
            <div className="container">
                <div className="row">
                    <div className="col-6 left">
                        <img src={mainPlaylistCover} alt=""/>
                    </div>
                    <div className="col-6 right">
                        { (isLogged) 
                            ? (actualPlaylist)
                                ?_renderTracks()
                                : ''
                            : _showSignIn()
                        }</div>
                </div>
            </div>
        </div>
        
    )
}
