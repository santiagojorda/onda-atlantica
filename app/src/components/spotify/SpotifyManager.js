import {URL_SERVER} from '../../common/constants'
import localStorageManager from '../../common/LocalStorageManager'

const HTTP_SUCCESSFUL_RESPONSE = 200

export default class SpotifyManager{

    localStorageManager = new localStorageManager()
    isLogged = false

    getAuthorization(){
        window.location.href = URL_SERVER+'auth'
    }

    _isSuccessfulResponse(_res){
        return (_res.statusCode === HTTP_SUCCESSFUL_RESPONSE)
    }
    
    _saveNewTokensInLocalStorage(_response){
        let { access_token, refresh_token, expires_in } = _response.body
        let expiration = Date.now() + (expires_in*1000); // expires_in: seconds and Date.now: miliseconds
        this.localStorageManager.setTokens(access_token, refresh_token, expiration)
    }

    authorizeCallback(_spotifyCode){
        
        const _url = URL_SERVER+"callback?code="+_spotifyCode
        return fetch(_url)
        .then(resp => resp.json())
        .then(data => {
            if(this._isSuccessfulResponse(data))
                this._saveNewTokensInLocalStorage(data)
            else
                throw data.body.error_description
        })   
    }

    /*getNewToken(){
        if (thereIsRefreshToken()){
            fetchNewTokenWithRefreshToken()
        }
        else{
            this.getAuthorization()
        }
    } */

    _tokenHasExpired(){
        const _expirationDate = this.localStorageManager.getTokenExpirationDate()
        const _dateNow = Date.now()
        if(_expirationDate >= _dateNow )
            return false
        return true
    }

    getAccessToken(){
        return new Promise( resolve => {
            if (!this._tokenHasExpired())
                resolve(this.localStorageManager.getAccessToken())
            }
        //else
            //getNewToken()
        )
    }

}