import { 
    URL_SERVER_AUTH,
    URL_SERVER_GET_TOKEN,
    URL_SERVER_PLAYER
} from '../../common/constants'
import SpotifyStorageManager from './SpotifyStorageManager'

const HTTP_SUCCESSFUL_RESPONSE = 200

export default class SpotifyManager{

    spotyStorage = new SpotifyStorageManager()
    isLogged = false

    async getAuthorization(){
        return new Promise( () => {
            window.location.href = URL_SERVER_AUTH
        })
    }

    _isSuccessfulResponse(_res){
        return (_res.statusCode === HTTP_SUCCESSFUL_RESPONSE)
    }
    
    _saveNewTokensInStorage(_response){
        let { access_token, refresh_token, expires_in } = _response.body
        let expiration = Date.now() + (expires_in*1000); // expires_in: seconds and Date.now: miliseconds
        this.spotyStorage.saveTokens(access_token, refresh_token, expiration)
    }

    _saveNewAccessTokenInStorage(_response){
        let { access_token, expires_in } = _response.body
        let expiration = Date.now() + (expires_in*1000); // expires_in: seconds and Date.now: miliseconds
        this.spotyStorage.saveAccessToken(access_token, expiration)
    }

    _fetchFunction(_url, _callback){
        return fetch(_url)
            .then(res => res.json())
            .then(data => {
                if(this._isSuccessfulResponse(data)){
                    _callback(data)
                }
                else
                    throw data.body.error_description
            })
    }

    _thereIsRefreshToken(){
        const _token = this.spotyStorage.getRefreshToken()
        return (_token != null)    
    }

    authorizeCallback(_spotifyCode){        
        const _url = URL_SERVER_GET_TOKEN+"?code="+_spotifyCode
        return this._fetchFunction(_url, this._saveNewTokensInStorage.bind(this))
    }

    _fetchNewTokenWithRefreshToken(){
        const _refreshToken = this.spotyStorage.getRefreshToken()
        const _url = URL_SERVER_GET_TOKEN+"?refresh="+_refreshToken
        return this._fetchFunction(_url, this._saveNewAccessTokenInStorage.bind(this))
    }
    
    async _getNewToken(){
        if (this._thereIsRefreshToken())
            return this._fetchNewTokenWithRefreshToken()
        
        //this function doesnt return a promise. this is a bad smell
        else
            return await this.getAuthorization()
    }

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

    getCurrentPlaybackData(){
        const _accessToken = this.spotyStorage.getAccessToken()
        const _url = URL_SERVER_PLAYER+"?access_token="+_accessToken
        return this._fetchFunction(_url)
    }

}