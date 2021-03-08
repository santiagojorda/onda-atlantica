import { useState, useEffect, Fragment } from "react";
import { Redirect, useLocation } from "react-router-dom";
import {useSpotifyManager} from './SpotifyProvider'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}  

export default function LogInCallback() {

    const {requestTokens} = useSpotifyManager()
    const _query = useQuery()
    const [wasLogged, setWasLogged] = useState(false)

    useEffect( ()=>{
      const _code = _query.get("code")
      requestTokens(_code)
        .then(() => setWasLogged(true))
        .catch(err => console.error(err))
   
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
      

    return <Fragment>
      {(wasLogged)
        ? <Redirect to='/' />
        : ''
      }
    </Fragment>

}
