import { useState, useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";

import {useSpotifyManager} from './SpotifyProvider'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}  

export default function LogInCallback() {

    const spoty = useSpotifyManager()
    const _query = useQuery()
    const [wasLogged, setWasLogged] = useState(false)

    useEffect( ()=>{
      const _code = _query.get("code")

      spoty.requestTokens(_code)
        .then(() => {
          setWasLogged(true)
        })
        .catch(err => console.error(err))
   
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
      
    function _renderRedirect(){
      if(wasLogged)
        return <Redirect to='/' />
      return <h1>Callback</h1>
    }

    return (
        _renderRedirect()
    )

}
