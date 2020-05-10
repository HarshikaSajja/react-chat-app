import React from 'react'
import './DirectMessages.css'
import firebase from '../../../firebase'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../../actions/index'

class DirectMessages extends React.Component {
    state = {
        users: [],
        activeChannel: '',
        user: this.props.currentUser,
        userRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('present')
    }

    componentDidMount() {
        if(this.state.user) {
            this.addListners(this.state.user.uid)
        }
    }

    addListners = (currentUserUid) => {
        let loadedUsers = []
        this.state.userRef.on('child_added', snap => {
            if(currentUserUid !== snap.key) {
                let user = snap.val()
                user['uid'] = snap.key
                user['status'] = 'away'
                loadedUsers.push(user)
                this.setState({
                    users: loadedUsers
                })
            }
        });

        this.state.connectedRef.on('value', snap => {
            if(snap.val() === true) {
                const ref = this.state.presenceRef.child(currentUserUid)
                ref.set(true)
                ref.onDisconnect().remove(error => {
                    if(error !== null) {
                        console.log(error)
                    }
                })
            }
        });

        this.state.presenceRef.on('child_added', snap => {
            if(currentUserUid !== snap.key) {
                this.addStatusToUser(snap.key)
            }
        })

        this.state.presenceRef.on('child_removed', snap => {
            if(currentUserUid !== snap.key) {
                this.addStatusToUser(snap.key, false)
            }
        })
    }

    addStatusToUser = (userId, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if(user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'away'}`
            }
            return acc.concat(user)
        }, []);
        this.setState({
            users: updatedUsers
        })
    }

    isUserOnline = (user) => user.status === 'online'

    changeChannel = (user) => {
        const channelId = this.getChannelId(user.uid)
        const channelData = {
            id: channelId,
            name: user.name
        }
        this.props.setCurrentChannel(channelData)
        this.props.setPrivateChannel(true)
        this.setActiveChannel(user.uid)
    }

    setActiveChannel = userId => {
        this.setState({
            activeChannel: userId
        })
    }

    getChannelId = (userId) => {
        const currentUserId = this.state.user.uid
        return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`
    }

    render() {
        return (
            <div className="dm-container">
                <h4 className="dm-title">Recent Chats ({this.state.users.length})</h4><br/>

                {this.state.users.map(user => (
                    this.isUserOnline(user) ? 
                        <p key={user.uid} style={{'--status-color': '#036431'}} 
                            onClick={() => this.changeChannel(user)} 
                            className={this.props.isPrivateChannel ? ((user.uid === this.state.activeChannel) ? 'chat-list-names active-channel' : 'chat-list-names') : 'chat-list-names'}>
                        @{user.name}
                        </p> 
                        : 
                        <p key={user.uid} style={{'--status-color': '#BE2612'}} 
                            onClick={() => this.changeChannel(user)} 
                            className={this.props.isPrivateChannel ? (user.uid === this.state.activeChannel) ? 'chat-list-names active-channel' : 'chat-list-names' : 'chat-list-names'}>
                        @{user.name}
                        </p>
                ))}
            </div>
        )
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages);