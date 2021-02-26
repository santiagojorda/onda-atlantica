

export default class LocalStorageManager{
    _saveItem(name, value){
        localStorage.setItem(name, value)
    }

    _getItem(name){
        return localStorage.getItem(name)
    }
} 