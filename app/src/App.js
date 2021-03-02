import Header from './components/header/Header'

import { Route, Switch } from "react-router-dom"
import LogInCallback from './components/spotify/LogInCallback';
import Auth from './components/spotify/Auth'
import PlayerComponent from './components/spotify/player/PlayerComponent';

// los provider al final
import ThemeProvider from "./components/theme/ThemeProvider";
import SpotifyProvider from "./components/spotify/SpotifyProvider";


export default function App() {  

  return (
    <ThemeProvider>
      <SpotifyProvider>
        <Header />

        <Switch>
          <Route exact path="/auth">
            <Auth />
          </Route>

          <Route exact path="/callback">
            <LogInCallback/>
          </Route>

          <Route exact path='/'>
            <PlayerComponent />
          </Route>
        
        </Switch>


      </SpotifyProvider>
    </ThemeProvider>
  );
}
