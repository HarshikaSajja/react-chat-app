import React from 'react'
import './UserPanel.css'
import firebase from '../../../firebase'

class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser
    }

    handleOptionSelect = ($) => {
        var selectBox = document.getElementById("selectBox");
        const selectedValue = selectBox.options[selectBox.selectedIndex].value;
        if(selectedValue === 'log_out'){
            firebase
                .auth()
                .signOut()
                .then(() => console.log('signed out!'))
        }
    }

    render() {
        return (
            <div className="user-panel-container" >
                <h2 style={{color:'white'}}>Chat App</h2>
                <img src={this.state.user.photoURL} alt="User Avatar" className="avatar" height="35px" width="35px"></img>
                <select id="selectBox" onChange={this.handleOptionSelect}>
                    <option value="log_in" hidden>{this.state.user.displayName}</option>
                    <option disabled style={{color:'grey',backgroundColor:'#fff'}}>Signed in as {this.state.user.displayName}</option>
                    <option value="log_out" style={{backgroundColor:'#EADDC8'}}>Log out</option>
                </select>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default UserPanel;