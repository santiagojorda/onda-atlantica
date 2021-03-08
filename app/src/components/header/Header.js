import React from 'react'
import { Link } from 'react-router-dom'
import './header.sass'
import { faFingerprint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useSessionState, useSpotifyManager} from '../spotify/SpotifyProvider'
import SignInButton from '../spotify/signInButton/SignInButton';

export default function Header() {

    const { 
        currentUser,
        disconnect
    } = useSpotifyManager()
    const isLogged = useSessionState()

    function _renderBrand(){
        return (
            <Link to="/" className="logo-container">
                <FontAwesomeIcon className='logo' icon={faFingerprint}/>
                <h1>Onda Atläntica</h1>
            </Link>
        )
    }

    function _renderSession(){
        if(isLogged && currentUser){
            return <p onClick={disconnect}>{currentUser.display_name}</p>
        }
        return <SignInButton/>
    }

    return (
        <header>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6 left">
                        {_renderBrand()}
                    </div>
                    <div className="col-6 right">
                        {_renderSession()}
                    </div>
                </div>
            </div>
        </header>
    )
}
