import React from 'react'
import './Channels.css'
import firebase from '../../../firebase'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../../actions/index'

class Channels extends React.Component {
    state = {
        user: this.props.currentUser,
        channel: null,
        channels: [],
        modal: false,
        channelName: '',
        icon: 'plus',
        channelRef: firebase.database().ref('channels'),
        messagesRef: firebase.database().ref('messages'),
        notifications: [],
        firstLoad: true,
        activeChannel: ''
    }

    componentDidMount() {
        this.addListners()
    }
    
    addListners = () => {
        let loadedChannels = [];
        this.state.channelRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({
                channels: loadedChannels
            }, () => this.setFirstChannel())
            this.addNotiificationListner(snap.key)
        })
    }

    addNotiificationListner = (channelId) => {
        this.state.messagesRef.child(channelId).on('value', snap => {
            if(this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap)
            }
        })
    }

    handleNotifications = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;
        let index = notifications.findIndex(notification => notification.id === channelId)
        if(index !== -1) {
            if(channelId !== currentChannelId) {
                lastTotal = notifications[index].total;
                if(snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            })
        }
        this.setState({ notifications })
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel)
            this.setActiveChannel(firstChannel);
            this.setState({
                channel: firstChannel
            })
        }
        this.setState({
            firstLoad: false
        })
    }

    inputChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    openModal = () => {
        this.setState({
            modal: true,
            icon: 'minus'
        })
    }

    closeModal = () => {
        this.setState({
            modal: false,
            icon: 'plus'
        })
    }

    addChannel = () => {
        const { channelRef, channelName, user } = this.state
        const key = channelRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({
                    channelName: ''
                })
                this.closeModal()
                console.log('channel added')
            })
            .catch(error => {
                console.log(error)
            })
    }
 
    changeChannel = (channel) => {
        this.setActiveChannel(channel);
        this.clearNotifications()
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false)
        this.setState({channel})
    }

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(
          notification => notification.id === this.state.channel.id
        );
    
        if (index !== -1) {
          let updatedNotifications = [...this.state.notifications];
          updatedNotifications[index].total = this.state.notifications[
            index
          ].lastKnownTotal;
          updatedNotifications[index].count = 0;
          this.setState({ notifications: updatedNotifications });
        }
      };

    setActiveChannel = (channel) => {
        this.setState({
            activeChannel: channel.id
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.isFormValid(this.state)) {
            this.addChannel()
        }

    }

    isFormValid = ({channelName}) => {
        return (channelName === "") ? false : true
    }

    getNotificationCount = channel => {
        let count = 0;
    
        this.state.notifications.forEach(notification => {
          if (notification.id === channel.id) {
            count = notification.count;
          }
        });
    
        if (count > 0) return count;
      };

    render() {
        const { channels, modal, icon } = this.state;
        
        const iconToggle = (icon === 'plus') ? <span onClick={this.openModal} id='clickableAwesomeFont'><i className="fa fa-plus" aria-hidden="true"></i></span> : <span onClick={this.closeModal} id='clickableAwesomeFont'><i className="fa fa-minus" aria-hidden="true"></i></span>

        const displayModal = modal ? (
            <form className="enter-channel-form">
                    <input type="text" placeholder="Enter channel name" name="channelName" onChange={this.inputChangeHandler}></input>
                    <button onClick={this.handleSubmit} className="channel-form-button" style={{marginLeft:'1px', marginRight:'6px',borderColor:'green',backgroundColor:'#B0F6A0'}}>Add</button>
                    <button onClick={this.closeModal} className="channel-form-button" style={{borderColor:'red',backgroundColor:'#F09F94'}}>Close</button>
                </form>
        ) : null

        return (
            <div className="channels-container">
                <h4 className="channels-title">Channels ({channels.length})</h4>
                {iconToggle}
                {displayModal}
                {channels.map(channel => <p className={this.props.isPrivateChannel ? 'channels-list' : ((channel.id === this.state.activeChannel) ? 'channels-list active-channel' : 'channels-list')}
                                            key={channel.id}
                                            onClick={() => this.changeChannel(channel)}
                                            name={channel.name}>
                                                #{channel.name}&nbsp;
                {this.getNotificationCount(channel) ? <label>{this.getNotificationCount(channel)}</label> : null}
                                            </p>)}
            </div>
        )
    }
}

export default connect(null, {setCurrentChannel, setPrivateChannel})(Channels);