import React from 'react'
import { Link } from 'react-router-dom'
import './header.sass'
import Logo from '../../images/logo.svg'
import { faFingerprint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {

    function _renderBrand(){
        return (
            <Link to="/">
                <div className="logo-container"> 
                    <FontAwesomeIcon className='Logo' icon={faFingerprint}/>
                    <h1>Onda Atläntica</h1>
                </div>
            </Link>
        )
    }

    return (
        <header style={_actualTheme}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        {_renderBrand()}
                    </div>
                </div>
            </div>
        </header>


    )
}
