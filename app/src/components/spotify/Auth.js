import {useEffect} from 'react'
import {useSpotifyManager} from './SpotifyProvider'

export default function Auth() {
    
    const spoty = useSpotifyManager()

    useEffect(() => {
        spoty.getAuthorization()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    return (
        <div>hola</div>
    )
}

