import React from 'react'
import './SidePanel.css'
import UserPanel from './UserPanel/UserPanel'
import Channels from './Channels/Channels'
import DirectMessages from './DirectMessages/DirectMessages'

class SidePanel extends React.Component {
    render() {
        const { currentUser, currentChannel, isPrivateChannel } = this.props

        return (
            <div className="side-panel-container">
                <UserPanel currentUser={currentUser}/>
                <hr style={{backgroundColor:'#ccc',color:'red',height:'3px'}}/>

                <Channels currentUser={currentUser}
                          isPrivateChannel={isPrivateChannel}/>

                <DirectMessages currentUser={currentUser}
                                isPrivateChannel={isPrivateChannel}/>
            </div>
        )
    }
}

export default SidePanel;