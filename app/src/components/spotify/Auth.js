import {useEffect} from 'react'
import {useSpotifyManager} from './SpotifyProvider'

export default function Auth() {
    
    const spoty = useSpotifyManager()

    useEffect(() => {
        spoty.getAuthorization()
    },[])
    
    return (
        <div>hola</div>
    )
}

