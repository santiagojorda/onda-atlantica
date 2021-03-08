import React, { useEffect, useContext, useState } from "react";
import {spotyStorage} from './SpotifyStorageManager'


const CLIENT_ID = '40d2fa449749415f9570c843dee768f6'
const CLIENT_SECRET = '26596c9d788a410d88dce1a3836bff19'
const REDIRECT_URI = 'http://localhost:3000/callback'
const TOKEN_URI = 'https://accounts.spotify.com/api/token'
const USER_PROFILE_ENDPOINT = 'https://api.spotify.com/v1/me'         
const PLAYER_ENDPOINT = 'https://api.spotify.com/v1/me/player'
const DEVICES_ENDPOINT = 'https://api.spotify.com/v1/me/player/devices'  
const PAUSE_PLAYER_ENDPOINT = 'https://api.spotify.com/v1/me/player/pause'     
const RESUME_PLAYER_ENDPOINT = 'https://api.spotify.com/v1/me/player/play'
const NEXT_TRACK_ENDPOINT = 'https://api.spotify.com/v1/me/player/next'
const SCOPES_API = 'streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state'; 
const REQUEST_AUTHORIZATION_URL = 'https://accounts.spotify.com/authorize?client_id='+CLIENT_ID+'&response_type=code&redirect_uri='+REDIRECT_URI+'&scope='+SCOPES_API
const REQUEST_TOKEN_URL = TOKEN_URI+'?redirect_uri='+REDIRECT_URI+'&grant_type=authorization_code&code='
const HTTP_NO_CONTENT = 204
// const HTTP_SUCCESSFUL_RESPONSE = 200

const SpotifyManagerContext = React.createContext();
const SessionStateContext = React.createContext();

export function useSpotifyManager(){
    return useContext(SpotifyManagerContext)
}

export function useSessionState(){
    return useContext(SessionStateContext)
}

export default function SpotifyProvider(props) {
    const [isLogged, setIsLogged] = useState(spotyStorage.thereIsRefreshToken())
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        _updateLoginState()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect( () => {
        async function _getCurrentUser(){
            setCurrentUser(await getCurrentUser())
        }

        if (isLogged)
            _getCurrentUser()
        else{
            setCurrentUser(null)
            spotyStorage.clearLocalStorage()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogged])

    function requestAuthorization(){
        window.location.href = REQUEST_AUTHORIZATION_URL
    }

    function requestTokens(_spotifyCode){
        const url = REQUEST_TOKEN_URL+_spotifyCode

        const data = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
            },
        }

        return _fetchJson(url, data)
            .then(data => _saveTokensInStorage(data)) 
    }

    function _parseExpirationTimeSecToMili(expires_in){
        return Date.now() + (expires_in*1000) // expires_in: seconds and Date.now: miliseconds
    }

    function _saveTokensInStorage(resp){
        let { access_token, refresh_token, expires_in } = resp
        spotyStorage.saveTokens(access_token, refresh_token, _parseExpirationTimeSecToMili(expires_in))
        setIsLogged(true)
    }

    function _saveAccessTokenInStorage(resp){
        let { access_token, expires_in } = resp
        spotyStorage.saveAccessToken(access_token, _parseExpirationTimeSecToMili(expires_in))
    }

    async function _updateLoginState(){
        if(spotyStorage.getRefreshToken())
            setIsLogged(true)
        else
            setIsLogged(false)
    }

    function getCurrentPlayback(){
        return getAccessToken()
            .then( access_token => { 
                const url = PLAYER_ENDPOINT
                const data = {
                    headers:{
                        'Authorization': 'Bearer '+ access_token  
                    }
                }
                return _fetchJson(url, data)
            })
    }

    function disconnect() {
        setIsLogged(false)
    }

    function getDevices(){
        return getAccessToken()
            .then( (access_token) => {
                const url = DEVICES_ENDPOINT 
                const data = {
                    headers:{
                        'Authorization': 'Bearer '+ access_token  
                    }
                }
                return _fetchJson(url, data)
                    .then( data => data.devices)
            })
    }

    function getPlaylist(playlist_id){
        return getAccessToken()
            .then( (access_token) => {
                const url = 'https://api.spotify.com/v1/playlists/'+playlist_id+'/tracks'
                const data = {
                    headers:{
                        'Authorization': 'Bearer '+ access_token  
                    }
                }
                return _fetchJson(url, data) 
            })
    }

    function getAccessToken(){
        return new Promise( (res,req) => {
            if(isLogged){
                if (_tokenHasExpired()){
                    _fetchNewTokenWithRefreshToken()
                        .then( () => res(spotyStorage.getAccessToken()))
                        .catch( err => req(err))
                }
                else
                    res(spotyStorage.getAccessToken())
            }
            else
                req('User is not logged, cannot get an Access Token')
        })
    }

    function _fetch(_url, _data){
        return fetch(_url, _data)
            .then( resp => {
                if(!resp.ok)
                    throw resp.message
            })
            .catch( err => console.error(err))
    }

    function _thereIsContent(_resp){
        return _resp.status !== HTTP_NO_CONTENT
    }

    function _fetchJson(_url, _data){
        return fetch(_url, _data)
            .then( resp => {
                if(!resp.ok)
                    throw resp.message
                if(_thereIsContent(resp))
                    return resp.json()
            })
            .catch( err => console.error(err))
    }

    function _tokenHasExpired(){
        const _expirationDate = spotyStorage.getTokenExpirationDate()
        if(_expirationDate >= Date.now() && _expirationDate != null)
            return false
        return true
    }

    function _fetchNewTokenWithRefreshToken(){
        const refresh_token = spotyStorage.getRefreshToken()
        if(refresh_token){
            const url = TOKEN_URI+'?refresh_token='+refresh_token+"&grant_type=refresh_token"
            
            const data = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
                }
            }

            return _fetchJson(url, data)
                .then(data => _saveAccessTokenInStorage(data))
        }
        else{
            setIsLogged(false)
            throw new Error("There is not a Refresh Token, cannot get a new refresh Access Token")
        }
    }

    function getCurrentUser(){
        return getAccessToken()
            .then( access_token => {
                const url =  USER_PROFILE_ENDPOINT
                const data = {
                    headers:{
                        'Authorization': 'Bearer '+ access_token  
                    }
                }
                return _fetchJson(url, data)
            })
    }

    function setCurrentTrack(context,pos){
        return getAccessToken()
            .then( access_token => {
                const url = PLAYER_ENDPOINT+'/play'
                const data = {
                    method: 'PUT',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ access_token  
                    },
                    body: JSON.stringify({
                        context_uri: context,
                        offset: {position: pos}
                    })
                }
                return _fetch(url, data)
            })
    }

    function pause(){
        return getAccessToken()
            .then( access_token => { 
                const url = PAUSE_PLAYER_ENDPOINT
                const data = {
                    method: 'PUT',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ access_token  
                    }
                }
                return _fetch(url, data)
            })
            .catch( err => console.error(err) )

    }

    function resume(){
        return getAccessToken()
            .then( access_token => { 
                const url = RESUME_PLAYER_ENDPOINT
                const data = {
                    method: 'PUT',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ access_token  
                    }
                }
                return _fetch(url, data)
            })
            .catch( err => console.error(err) )
    }

    function transferPlayback(device_id){
        return getAccessToken()
            .then( access_token => { 
                const url = PLAYER_ENDPOINT
                const data = {
                    method: 'PUT',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ access_token  
                    },
                    body: JSON.stringify({
                        'device_ids': [device_id],
                    })
                }
                return _fetch(url, data)
            })
    }

    function nextTrack(){
        return getAccessToken()
            .then( access_token => { 
                const url = NEXT_TRACK_ENDPOINT 
                const data = {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ access_token  
                    }
                }
                return _fetch(url, data)
            })
            .catch( err => console.error(err))
    }


    return (
        <SpotifyManagerContext.Provider 
            value={{
                requestAuthorization,
                requestTokens,
                getAccessToken,
                getPlaylist,
                setCurrentTrack,
                getDevices,
                getCurrentUser,
                getCurrentPlayback,
                pause,
                resume,
                nextTrack,
                disconnect,
                transferPlayback,
                currentUser,

            }}>
            <SessionStateContext.Provider value={isLogged}>
                {props.children}
            </SessionStateContext.Provider>
        </SpotifyManagerContext.Provider>
    )
}


