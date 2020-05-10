import React from 'react'
import './MessageHeader.css'

class MessageHeader extends React.Component {
    
    render() {
        return (
            <div className="message-header-container">
                <div style={{zIndex:'1'}}>
                    <h4 className={(this.props.channelName.charAt(0) === '#') ? 'channel-header' : 'channel-header-noIcon'}>{this.props.channelName}</h4>
                </div>
                    {this.props.channelName.charAt(0) === '#' ? <p>{this.props.numUniqueUsers}</p> : null }
                {/* <p>{this.props.numUniqueUsers}</p> */}
                <input className="message-search" onChange={this.props.handleMessageSearch} placeholder="&#xF002;  Search Messages" type="text"></input>
            </div>
        )
    }
}

export default MessageHeader;