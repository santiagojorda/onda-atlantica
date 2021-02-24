import ThemeProvider from "./components/theme/ThemeProvider";
import Header from './components/header/Header'
export default function App() {
  

  return (
    <ThemeProvider>
      <Header />
    </ThemeProvider>
  );
}

