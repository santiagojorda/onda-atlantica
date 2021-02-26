import LocalStorageManager from '../../common/LocalStorageManager'

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'
const TOKEN_EXPIRATION = 'token_expiration'

export default class SpotifyStorageManager extends LocalStorageManager{

    saveTokens(_newAccessToken, _newRefreshToken, _expiration){
        this.saveAccessToken(_newAccessToken, _expiration)
        this._saveItem(REFRESH_TOKEN, _newRefreshToken)
    }

    saveAccessToken(_newAccessToken, _expiration){
        this._saveItem(ACCESS_TOKEN, _newAccessToken)
        this._saveItem(TOKEN_EXPIRATION, _expiration)
    }

    getAccessToken(){
        return this._getItem(ACCESS_TOKEN)
    }

    getRefreshToken(){
        return this._getItem(REFRESH_TOKEN)
    }

    getTokenExpirationDate(){
        return this._getItem(TOKEN_EXPIRATION)
    }

    clearLocalStorage(){
        localStorage.clear()
    }

} 