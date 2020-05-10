import React from 'react'
import './Messages.css'
import MessageHeader from './MessageHeader/MessageHeader'
import MessageForm from './MessageForm/MessageForm'
import firebase from '../../firebase'
import SenderMessage from './SenderMessage/SenderMessage'
import MessagesSkeleton from '../MessagesSkeleton/MessagesSkeleton'

class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        loadingMessages: true,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: []
    }

    componentDidMount() {
        const { channel, user } = this.state;
        if(channel && user) {
            this.addListners(channel.id)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.messagesEnd) {
            this.scrollToBottom()
        }
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: 'smooth'})
    }

    addListners = channelId => {
        this.addMessageListner(channelId)
    }

    addMessageListner = channelId => {
        let loadedMessages = [];
        const ref = this.getMessagesRef()
        ref.child(channelId)
            .on('child_added', snap => {
                loadedMessages.push(snap.val());
                this.setState({
                    messages: loadedMessages,
                    loadingMessages: false
                })
        });
        if(loadedMessages.length < 1){
            this.setState({ loadingMessages: false })
        }
        this.countUsers(loadedMessages)
    }

    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state
        return privateChannel ? privateMessagesRef : messagesRef
    }

    handleMessageSearch = (event) => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.searchMessage())
    }

    searchMessage = () => {
        const messages = [...this.state.messages]
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = messages.reduce((acc, message) => {
            if(message.content && message.content.match(regex) || message.user.name.match(regex)){
                acc.push(message)
            }
            return acc;
        }, []);
        this.setState({
            searchResults: searchResults
        })
    }

    countUsers = (messages) => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name)
            }
            return acc;
        }, []);
        const checkMultipleUsers = uniqueUsers.length > 1 || uniqueUsers.length === 0;
        const noUniqueUsers = `${uniqueUsers.length} User${checkMultipleUsers ? 's' : ''}`
        this.setState({
            numUniqueUsers: noUniqueUsers
        })
    }

    displayChannelName = (channel) => {
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : ''
    }

    displayMessages = (messages, user) => (
        messages.length > 0 ? (messages.map(message => (
            <SenderMessage key={message.timestamp}
                           message={message}
                           user={user}/>
        ))) : this.state.loadingMessages ? null : <p className="empty-channel-alert" >No messages yet. Send messages to start collaborating</p>
    )

    displayMessagesSkeleton= (loading) => (
            loading ? (
                <div>
                    {[...Array(10)].map((_, i) => (
                        <MessagesSkeleton key={i}/>
                    ))}
                </div>
            ) : null
    )

    render() {
        const { messagesRef, messages, channel, user, numUniqueUsers, searchResults, privateChannel,
        loadingMessages } = this.state;

        return (
            <div className="messages-container">
                <MessageHeader numUniqueUsers={numUniqueUsers}
                               channelName={this.displayChannelName(channel)}
                               handleMessageSearch={this.handleMessageSearch}
                               isPrivateChannel={privateChannel}/>
                <div className="messages scrollbar">
                    {this.displayMessagesSkeleton(loadingMessages)}
                    {this.state.searchTerm ? this.displayMessages(searchResults, user) : this.displayMessages(messages, user)}
                    <div  ref={node => (this.messagesEnd = node)} ></div>
                </div>
                <MessageForm messagesRef={messagesRef} 
                             currentChannel={channel}
                             currentUser={user}
                             isPrivateChannel={privateChannel}
                             getMessagesRef={this.getMessagesRef}/>
            </div>
        )
    }
}

export default Messages;