import React from 'react'
import './SenderMessage.css'

const isImage = (message) => {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content')
}

const senderMessage = ({ message, user}) => (
    <div className="sender-message-container">
        <img className="sender-avatar" src={message.user.avatar} alt="sender avatar" height="35px" width="35px"></img>
        <label className="sender-name">{message.user.name}</label>
        {/* <p className="sender-message">{message.content}</p> */}
        {isImage(message) ? <img src={message.image} className="uploaded-image" alt="uploaded image"/> : <p className="sender-message">{message.content}</p>}
    </div>
)

export default senderMessage;