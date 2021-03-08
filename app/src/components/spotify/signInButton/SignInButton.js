import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import {useSpotifyManager} from '../SpotifyProvider'
import './SignInButton.sass'
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
export default function SignInButton() {

    const {requestAuthorization} = useSpotifyManager()

    return (
        <div className='sign-in' onClick={requestAuthorization}>
            <FontAwesomeIcon className='spotify' icon={faSpotify} />
            <p>Sign In With Spotify</p>
        </div>
    )
}
