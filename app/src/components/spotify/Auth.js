import {useEffect} from 'react'
import {useSpotifyManager} from './SpotifyProvider'

export default function Auth() {
    
    const spoty = useSpotifyManager()

    useEffect(() => {
        spoty.requestAuthorization().catch( err => console.error(err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    return (
        <div>Log in</div>
    )
}

