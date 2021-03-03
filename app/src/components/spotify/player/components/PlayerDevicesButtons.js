import React, { Component, Fragment } from 'react'

export class PlayerDevicesButtons extends Component {
    
    render() {
        return (
            <Fragment>
                {(this.props.devices !== null) 
                    ? this.props.devices.map((device, i) => {
                        return <p key={i} style={ (device.is_active) ? {color:'red'} : {} } onClick={()=>this.props.onTransferPlayback(device.id)}>{device.name}</p>
                    })
                    : <p>No devices connected</p>
                }
            </Fragment>
        )
    }
}

export default PlayerDevicesButtons
