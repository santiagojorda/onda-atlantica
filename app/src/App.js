import ThemeProvider from "./components/theme/ThemeProvider";
import Header from './components/header/Header'
import { Route, Switch, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function App() {
  
  let query = useQuery()

  return (
    <ThemeProvider>
      <Header />

      <Switch>
        <Route exact path="/auth">
          { () => {
            window.location.href = 'http://localhost:4000/spoty/auth'
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
  
  return (
    <div>
      the code is: {_code}
    </div>
  )
}


