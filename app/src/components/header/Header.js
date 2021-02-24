import React from 'react'
import { Link } from 'react-router-dom'
import {useTheme, useThemeToggler} from '../theme/ThemeProvider'
import './header.sass'

export default function Header() {

    const _actualTheme = useTheme()
    const _togglerTheme = useThemeToggler()

    function _renderBrand(){
        return (
            <Link to="/">
                <h1>Onda Atlantica</h1>
            </Link>
        )
    }

    function _renderTogglerTheme(){
        return (
            <button onClick={_togglerTheme}>Change</button>
        )
    }

    return (
        <header style={_actualTheme}>
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-3 column">
                        {_renderBrand()}
                    </div>

                    <div className="col-3 column">
                        {_renderTogglerTheme()}
                    </div>
                </div>
            </div>
        </header>


    )
}