import React from 'react';
import './App.css';
import SidePanel from './components/SidePanel/SidePanel'
import Messages from './components/Messages/Messages'
import MetaPanel from './components/MetaPanel/MetaPanel'
import { connect } from 'react-redux'

const App = ({ currentUser, currentChannel, isPrivateChannel }) => {
  return (
    <div className="main-layout-container">
      <SidePanel key={currentUser && currentUser.uid} 
                 currentUser={currentUser} 
                 currentChannel={currentChannel}
                 isPrivateChannel={isPrivateChannel}/>
                 
      <Messages key={currentChannel && currentChannel.id} 
                currentChannel={currentChannel}
                currentUser={currentUser}
                isPrivateChannel={isPrivateChannel}/>
    </div>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel
})

export default connect(mapStateToProps)(App);