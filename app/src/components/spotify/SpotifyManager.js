import { 
    URL_SERVER_AUTH
} from '../../common/constants'

import SpotifyStorageManager from './SpotifyStorageManager'

const CLIENT_ID = '40d2fa449749415f9570c843dee768f6'
const CLIENT_SECRET = '26596c9d788a410d88dce1a3836bff19'
const REDIRECT_URI = 'http://localhost:3000/callback'
const TOKEN_URI = 'https://accounts.spotify.com/api/token'
const PLAYER_ENDPOINT = 'https://api.spotify.com/v1/me/player'

const HTTP_NO_CONTENT = 204
const HTTP_SUCCESSFUL_RESPONSE = 200

export default class SpotifyManager{

    spotyStorage = new SpotifyStorageManager()
    isLogged = false


    async requestAuthorization(){
        return new Promise( () => {
            window.location.href = URL_SERVER_AUTH
        })
    }

    requestTokens(_spotifyCode){        
        const _url = TOKEN_URI+'?redirect_uri='+REDIRECT_URI+'&code='+_spotifyCode+"&grant_type=authorization_code"

        const _data = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
            },

        }
        return fetch(_url, _data)
                .then( resp => {
                    if(resp.ok){
                        return resp.json()
                    }
                    else 
                        throw resp
                })
                .then(data => {
                    this._saveNewTokensInStorage(data)
                }) 

    }

    _saveNewTokensInStorage(_response){
        let { access_token, refresh_token, expires_in } = _response
        let expiration = Date.now() + (expires_in*1000); // expires_in: seconds and Date.now: miliseconds
        this.spotyStorage.saveTokens(access_token, refresh_token, expiration)
    }

    // token has expired or there is not any token
    _tokenHasExpired(){
        const _expirationDate = this.spotyStorage.getTokenExpirationDate()
        const _dateNow = Date.now()
        if(_expirationDate >= _dateNow && _expirationDate != null)
            return false
        return true
    }

    getAccessToken(){
        if (this._tokenHasExpired()){
            return this._getNewToken()
                .then( () => this.spotyStorage.getAccessToken() ) 
        }
        else {
            return new Promise( resolve => {
                resolve(this.spotyStorage.getAccessToken())
            })
        }
    
    }

    async _getNewToken(){
        if (this._thereIsRefreshToken())
            return this._fetchNewTokenWithRefreshToken()
        
        //this function doesnt return a promise. this is a bad smell
        else
            return await this.requestAuthorization()
    }

    _thereIsRefreshToken(){
        const _token = this.spotyStorage.getRefreshToken()
        return (_token != null)    
    }

    _isSuccessfulResponse(_res){
        return (_res.statusCode === HTTP_SUCCESSFUL_RESPONSE)
    }
    
    _saveNewAccessTokenInStorage(_response){
        let { access_token, expires_in } = _response.body
        let expiration = Date.now() + (expires_in*1000); // expires_in: seconds and Date.now: miliseconds
        this.spotyStorage.saveAccessToken(access_token, expiration)
    }

    _fetchNewTokenWithRefreshToken(){
        const _refreshToken = this.spotyStorage.getRefreshToken()
        const _url = TOKEN_URI+'?refresh_token='+_refreshToken+"&grant_type=refresh_token"
        const _data = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
            }
        }

        return fetch(_url, _data)
            .then( resp => {
                if(resp.ok)
                    return resp.json()
                else 
                    throw resp.message
            })
            .then(data => {
                this._saveNewTokensInStorage(data)
            }) 
    }

    _fetchFunction(_url, _data, _callback){
        return fetch(_url, _data)
            .then( resp => {
                if(resp.ok)
                    return resp.json()
                else 
                    throw resp
            })
            .then(data => {
                _callback(data)
            })
    }

    async pause(){
        const _access_token = await this.getAccessToken()
        const _url = 'https://api.spotify.com/v1/me/player/pause'
        const _data = {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ _access_token  
            }
        }
        this._fetch(_url, _data)
    }

    async resume(){
        const _access_token = await this.getAccessToken()
        const _url = 'https://api.spotify.com/v1/me/player/play'
        const _data = {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ _access_token  
            }
        }
        this._fetch(_url, _data)
    }

    async nextTrack(){
        const _access_token = await this.getAccessToken()
        const _url = 'https://api.spotify.com/v1/me/player/next'
        const _data = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ _access_token  
            }
        }
        this._fetch(_url, _data)
    }
        
    async _getPlaylist(_playlist_id){
        const _access_token = await this.getAccessToken()
        const _url = 'https://api.spotify.com/v1/playlists/'+_playlist_id+'/tracks'
        const _data = {
            headers:{
                'Authorization': 'Bearer '+ _access_token  
            }
        }
        return await this._fetchJson(_url, _data)
    }

    _fetch(_url, _data){
        return fetch(_url, _data)
            .then( resp => {
                if(!resp.ok)
                    throw resp.message
            })
            .catch( err => console.error(err))
    }

    _thereIsNoContent(_resp){
        return _resp.status !== HTTP_NO_CONTENT
    }

    _fetchJson(_url, _data){
        return fetch(_url, _data)
            .then( resp => {
                if(!resp.ok)
                    throw resp.message
                if(this._thereIsNoContent(resp))
                    return resp.json()
            })
            .catch( err => console.error(err))
    }

    async transferUserPlayback(_device_id){
        const _access_token = await this.getAccessToken()
        const _url = PLAYER_ENDPOINT
        const _data = {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ _access_token  
            },
            body: JSON.stringify({
                'device_ids': [_device_id],
            })
        }
        return this._fetch(_url, _data)
    }

    async getDevicesInfo(){
        const _access_token = await this.getAccessToken()
        const _url = 'https://api.spotify.com/v1/me/player/devices'         
        const _data = {
            headers:{
                'Authorization': 'Bearer '+ _access_token  
            }
        }
        return await this._fetchJson(_url, _data)
            .then( data => data.devices)
    }

    async getCurrentPlayback(){
        const _access_token = await this.getAccessToken()
        const _url = 'https://api.spotify.com/v1/me/player'         
        const _data = {
            headers:{
                'Authorization': 'Bearer '+ _access_token  
            }
        }
        return await this._fetchJson(_url, _data)
    }

    async setActualTrack(_context,_offset){
        const _access_token = await this.getAccessToken()
        const _url = PLAYER_ENDPOINT+'/play'
        const _data = {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ _access_token  
            },
            body: JSON.stringify({
                context_uri: _context,
                offset: {position: _offset}
            })
        }
        return await this._fetch(_url, _data)
    }


}