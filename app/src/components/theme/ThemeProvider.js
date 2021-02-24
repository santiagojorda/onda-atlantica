import React, {useState, useContext}from 'react'
import themes from './themes'

const ThemeContext = React.createContext();
const ThemeTogglerContext = React.createContext();


export function useTheme(){
    return useContext(ThemeContext)
}

export function useThemeToggler(){
    return useContext(ThemeTogglerContext)
}

export default function ThemeProvider(props) {
    
    const [theme, setTheme] = useState(themes.dark)
    function _isLight(){
        return (theme === themes.light)
    }

    function toggleTheme(){
        if (_isLight())
            setTheme(themes.dark)
        else
            setTheme(themes.light)
    }

    return (

        <ThemeContext.Provider value={theme}>
            <ThemeTogglerContext.Provider value={toggleTheme}>
                {props.children}
            </ThemeTogglerContext.Provider>
        </ThemeContext.Provider>

    )
}
