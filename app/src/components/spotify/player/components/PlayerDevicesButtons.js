import React, { Component, Fragment } from 'react'
import './devices.sass'

import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NAV_ID = 'nav-devices'
const BTN_ID = 'btn-show-devices'

export class PlayerDevicesButtons extends Component {

    _menuIsDisplayed = false

    constructor(props){
        super(props)
        this._clickEvent = this._clickEvent.bind(this)
    }

    _createClickListenerNavCloser(){
        document.addEventListener('click', this._clickEvent, false);
    }

    _removeClickListenerNavCloser(){
        document.removeEventListener('click', this._clickEvent, false);
    }

    _clickEvent(_event){
        if(_event.target.id !== NAV_ID && _event.path[1].id !== BTN_ID)
            this._hideNav()
    }
    
    _hideNav(){
        this._menuIsDisplayed = false
        this._removeClickListenerNavCloser()
        document.getElementById(NAV_ID).style.display = 'none';
    }

    _showNav(){
        this._menuIsDisplayed = true
        this._createClickListenerNavCloser()
        document.getElementById(NAV_ID).style.display = 'block';
    }

    _thereIsAtLeastOneDevice(){
        return this.props.devices !== null
    }

    _renderMenuDevices(){
        return (
            <nav id='nav-devices' className='nav-devices'>
                <ul>
                    {this.props.devices.map((device, i) => {
                        return <li key={i} onClick={()=> {
                            this.props.onTransferPlayback(device.id)
                            this._toggleNav()
                        }
                    }>{device.name}</li>
                    })}
                </ul>
            </nav>
        )
    }

    _getDeviceActiveName(){
        for (let _device of this.props.devices) {
            if(_device.is_active)
                return _device.name
        }
    }

    _toggleNav(){
        if(this._menuIsDisplayed)
            this._hideNav()
        else
            this._showNav()
    }

    _currentPlaybackDevice(){
        return <button onClick={() => this._toggleNav()} id={BTN_ID}>
                <p className='active-device'>{this._getDeviceActiveName()} <FontAwesomeIcon icon={faCaretUp} /></p>
            </button>
        
    }

    _renderDevices(){
        return (
            <Fragment>
                {this._currentPlaybackDevice()}
                {this._renderMenuDevices()}
            </Fragment>
        )
    }

    render() {
        return (
            <Fragment>
                {(this._thereIsAtLeastOneDevice()) 
                    ? this._renderDevices()
                    : <p>No devices connected</p>
                }
            </Fragment>
        )
    }
}

export default PlayerDevicesButtons
