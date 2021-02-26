

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'
const TOKEN_EXPIRATION = 'token_expiration'

export default class localStorageManager{

    _setItem(name, value){
        localStorage.setItem(name, value)
    }

    _getItem(name){
        return localStorage.getItem(name)
    }

    setTokens(_newAccessToken, _newRefreshToken, _expiration){
        this.setAccessToken(_newAccessToken, _expiration)
        this._setItem(REFRESH_TOKEN, _newRefreshToken)
    }

    setAccessToken(_newAccessToken, _expiration){
        this._setItem(ACCESS_TOKEN, _newAccessToken)
        this._setItem(TOKEN_EXPIRATION, _expiration)
    }

    getAccessToken(){
        return this._getItem(ACCESS_TOKEN)
    }

    getTokenExpirationDate(){
        return this._getItem(TOKEN_EXPIRATION)
    }

    clearLocalStorage(){
        localStorage.clear()
    }

} 