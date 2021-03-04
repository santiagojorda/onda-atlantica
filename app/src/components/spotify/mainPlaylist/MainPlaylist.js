import React, { useState, useEffect } from 'react'
import {useSpotifyManager} from '../SpotifyProvider'
import mainPlaylistCover from '../../../images/covers/main-playlist.jpg'
import './mainPlaylist.sass'
const MAIN_PLAYLIST_ID = '2HEJBPwHCrWlvd9s4r2Nte'
const MAIN_PLAYLIST_URI = 'spotify:playlist:2HEJBPwHCrWlvd9s4r2Nte'
const THERE_IS_NO_ACTIVE_ITEM = -1
export default function MainPlaylist() {

    const spotyManager = useSpotifyManager()
    const [actualPlaylist, setActualPlaylist] = useState(null)
    const [activeItem, setItemActive] = useState(-1)

    useEffect(() => {
        _getMainPlaylist(MAIN_PLAYLIST_ID)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function _setTracksToActualPlaylist(_playlist){
        setActualPlaylist(_playlist.items)
    }

    async function _getMainPlaylist(_playlist_id){
        const _playlist = await spotyManager._getPlaylist(_playlist_id)
        _setTracksToActualPlaylist(_playlist)
    } 

    function _renderActiveTrackContainer(_item, _pos){
        return <div key={_pos} className="active-item shadow border">
            <div className="top">
                <div className="circle">
                    <p className='position'>{_pos+1}</p>
                </div>
                <div className="info">
                    <p className='title'>{_item.track.name}</p>
                    <p className='artist'>{_item.track.artists[0].name}</p>
                </div>
            </div>

            <div className="bottom">
                <img src={_item.track.album.images[2].url} alt=""/>
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

    function _trackOnClick(_item, _pos){
        spotyManager.setActualTrack(MAIN_PLAYLIST_URI, _pos)
            .then( () => {
                setItemActive(_pos)
            })
    }

    function _renderTracks(){
        return (
            <ol className='track-list'>
                {actualPlaylist.map( (_item, _pos) => {

                    return <div className='item' key={_pos} onClick={() => _trackOnClick(_item, _pos)}>
                        {(_pos === activeItem)
                            ? _renderActiveTrackContainer(_item, _pos)
                            : _renderListItem(_item, _pos)
                        }
                    </div>
                })}
            </ol>

        )
    }

    return (
        <div className="main-playlist">
            <div className="container">
                <div className="row">
                    <div className="col-7 left">
                        <img src={mainPlaylistCover} alt=""/>
                    </div>
                    <div className="col-5 right">
                        {
                            (actualPlaylist !== null)
                                ? _renderTracks()
                                : <p>there is no playlist</p>
                        }
                    </div>
                </div>
            </div>
        </div>
        
    )
}
