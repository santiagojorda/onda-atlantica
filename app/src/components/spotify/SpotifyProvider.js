import React, { useContext } from "react";
import SpotifyManager from "./SpotifyManager";

const SpotifyManagerContext = React.createContext();

export function useSpotifyManager(){
    return useContext(SpotifyManagerContext)
}

export default function SpotifyProvider(props) {
    
    const spoty = new SpotifyManager
    
    return (
        <SpotifyManagerContext.Provider value={spoty}>
            {props.children}
        </SpotifyManagerContext.Provider>
    )
}
