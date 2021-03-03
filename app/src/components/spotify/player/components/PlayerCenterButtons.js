import React from 'react'
import { faPause, faPlay, faStepForward, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class PlayerCenterButtons extends React.Component {

    constructor(props){
        super(props)
        this._togglePlayer = this._togglePlayer.bind(this)
    }


    _togglePlayer() {
        if(this.props.isPlaying)
            this.props.onPause()
        else
            this.props.onResume()
    }

    _thereIsDeviceConnected(){
        return true
    }

    _showButtons(){
        return  <React.Fragment>
                    <button>
                        <FontAwesomeIcon className='volume' icon={faVolumeUp} />
                    </button>

                    <button onClick={this._togglePlayer}>
                        <FontAwesomeIcon className='resume' icon={this.props.isPlaying ? faPause : faPlay } />
                    </button>
                    
                    <button onClick={this.props.onNextTrack}>
                        <FontAwesomeIcon className='next' icon={faStepForward} />
                    </button>
                </React.Fragment>
    }

    render() {
        return (
            this._showButtons()
            // (this._thereIsDeviceConnected())
            //     ? this._showButtons()
            //     : <p>Please connect your device.</p>   
        )
    }
}
