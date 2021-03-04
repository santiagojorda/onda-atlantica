import React from 'react'
import { Link } from 'react-router-dom'
import {useTheme, useThemeToggler} from '../theme/ThemeProvider'
import './header.sass'
import Logo from '../../images/logo.svg'

export default function Header() {

    const _actualTheme = useTheme()
    const _togglerTheme = useThemeToggler()

    function _renderBrand(){
        return (
            <Link to="/">
                <div className="logo-container"> 
                    <div className="line" style={{width: '5%'}}></div>
                    <img src={Logo} alt=""/>
                    <h1>Onda Atläntica</h1>
                    <div className="line"></div>
                </div>
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
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        {_renderBrand()}
                    </div>

                    {/* <div className="col-3 column">
                        {_renderTogglerTheme()}
                    </div> */}
                </div>
            </div>
        </header>


    )
}
