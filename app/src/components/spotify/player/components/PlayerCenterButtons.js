import React from 'react'
import { faPause, faPlay, faStepForward, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class PlayerCenterButtons extends React.Component {

    constructor(props){
        super(props)
        this._togglePlayer = this._togglePlayer.bind(this)
    }

    _isPlaying(){
        return !this.props.actualState.paused
    }
    

    _togglePlayer() {
        console.log(this.props.actualState)
        if(this._isPlaying())
            this.props.onPause()
        else
            this.props.onResume()
    }

    _thereIsState(){
        return this.props.actualState != null
    }

    _showButtons(){
        return  <React.Fragment>
                    <button>
                        <FontAwesomeIcon className='volume' icon={faVolumeUp} />
                    </button>

                    <button onClick={this._togglePlayer}>
                        <FontAwesomeIcon className='resume' icon={this._isPlaying() ? faPause : faPlay } />
                    </button>
                    
                    <button onClick={this.props.onNextTrack}>
                        <FontAwesomeIcon className='next' icon={faStepForward} />
                    </button>
                </React.Fragment>
    }

    render() {
        return (
            (this._thereIsState())
                ? this._showButtons()
                : <p>Please connect your device.</p>   
        )
    }
}
