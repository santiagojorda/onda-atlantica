import React from 'react'
import { Link } from 'react-router-dom'
import './header.sass'
import { faFingerprint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {

    function _renderBrand(){
        return (
            <Link to="/" className="logo-container">
                <FontAwesomeIcon className='logo' icon={faFingerprint}/>
                <h1>Onda Atläntica</h1>
            </Link>
        )
    }

    return (
        <header>
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
