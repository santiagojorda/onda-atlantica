export default function importScript(url){

    return new Promise( (resolve,reject) => {
        let _script = document.createElement('script');
        _script.type = 'text/javascript';
        _script.src = url;
        
        let _elements = document.getElementsByTagName('head')
        if (_elements.length <= 0) 
            reject()
        _elements[0].appendChild(_script);
        resolve()
    })
}