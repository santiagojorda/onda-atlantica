import Header from './components/header/Header'

import { Route, Switch } from "react-router-dom"
import LogInCallback from './components/spotify/LogInCallback';
import PlayerComponent from './components/spotify/player/PlayerComponent';
import MainPlaylist from './components/spotify/mainPlaylist/MainPlaylist';

// los provider al final
import SpotifyProvider from "./components/spotify/SpotifyProvider";


export default function App() {  

  return (
    <SpotifyProvider>
      <Header />

      <Switch>

        <Route exact path="/callback">
          <LogInCallback/>
        </Route>

        <Route exact path='/'>
          <MainPlaylist />
          <PlayerComponent /> 
        </Route>
      
      </Switch>


    </SpotifyProvider>
  );
}
