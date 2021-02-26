import { useState, useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";

import {useSpotifyManager} from './SpotifyProvider'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}  

export default function LogInCallback() {

    const spoty = useSpotifyManager()
    let _query = useQuery()
    const [wasLogged, setWasLogged] = useState(false)

    useEffect( ()=>{
      const code = _query.get("code")

      spoty.authorizeCallback(code)
        .then(() => {
          setWasLogged(true)
        })
        .catch(err => console.error(err))
   
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
      
    function _renderRedirect(){
      if(wasLogged)
        return <Redirect to='/rep' />
      return <h1>Callback</h1>
    }

    return (
      <div>
        {_renderRedirect()}
      </div>
    )

}
