import ThemeProvider from "./components/theme/ThemeProvider";
import Header from './components/header/Header'
import { Route, Switch, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const URL_SERVER = "http://localhost:4000/spoty/"

export default function App() {
  
  let query = useQuery()

  return (
    <ThemeProvider>
      <Header />

      <Switch>
        <Route exact path="/auth">
          { () => {
            window.location.href = URL_SERVER+'auth'
            return false
            }
          }

        </Route>
        <Route exact path="/callback">
          <Callback code={query.get("code")} />
        </Route>

      </Switch>

    </ThemeProvider>
  );
}

function Callback(props) {
  
  const _code = props.code

  async function _fetchToken(){
    const _response = await fetch(URL_SERVER+"callback?code="+_code, {
      mode: 'no-cors',
      
    })
      .then(response => response.json())
    return _response
  }

  function _getToken(){
    console.log(_fetchToken())
  }
  

  return (
    <div>
      the code is: {_code}
      <hr/>
      {_getToken()}
    </div>
  )
}


