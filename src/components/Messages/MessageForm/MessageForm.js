import React from 'react'
import './MessageForm.css'
import uuidv4 from 'uuid/v4'
import firebase from '../../../firebase'
import Modal from '../../Modal/Modal'

class MessageForm extends React.Component {
    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        classname: 'send-message',
        modal: false,
        uploadState: '',
        uploadTask: null,
        percentUploaded: 0,
        storageRef: firebase.storage().ref()
    }

    openModal = () => this.setState({ modal: true })

    closeModal = () => this.setState({ modal: false })

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    createMessage = (fileURL = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
        }
        if(fileURL != null) {
            message['image'] = fileURL
        } else {
            message['content'] = this.state.message
        }
        return message;
    }

    sendMessage = () => {
        const { getMessagesRef } = this.props;
        const { message, channel } = this.state;
        if(message) {
            this.setState({
                loading: true
            });
            getMessagesRef()
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({
                        loading: false,
                        message: '',
                        errors: []
                    })
                })
                .catch(error => {
                    console.error(error);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(error),
                        classname: 'send-message-error'
                    })
                })
        }else {
            this.setState({
                errors: this.state.errors.concat('Add a message'),
                classname: 'send-message-error'
            })
        }
    }

    uploadFile = (file, metaData) => {
        const uploadPath = this.state.channel.id
        const ref = this.props.messagesRef
        const filePath = `chat/public/${uuidv4()}.jpg`;
        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metaData)
        }, () => {
            this.state.uploadTask.on('state_changed', snap => {
                const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
                this.setState({ percentUploaded })
            }, error => {
                console.error(error)
                this.setState({
                    errors: this.state.errors.concat(error),
                    uploadState: 'error',
                    uploadTask: null
                })
            }, () => {
                this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    this.sendFileMessage(downloadURL, ref, uploadPath)
                })
                .catch(error => {
                    console.error(error)
                    this.setState({
                    errors: this.state.errors.concat(error),
                    uploadState: 'error',
                    uploadTask: null
                })
                })
            })
        })
    }

    sendFileMessage = (fileURL, ref, uploadPath) => {
        ref.child(uploadPath)
            .push()
            .set(this.createMessage(fileURL))
            .then(() => {
                this.setState({ uploadState: 'success'})
            })
            .catch(error => {
                console.error(error)
                this.setState({
                    errors: this.state.errors.concat(error)
                })
            })
    }

    render() {
        const { errors, classname, message, loading, modal } = this.state

        return (
            <div className="message-form-container">
                <input 
                    className={classname} 
                    id="message_box" 
                    value={message} name="message" 
                    onChange={this.handleChange}
                    placeholder="&#xF067;  Write your message" 
                    type="text">
                </input>
                <button style={{backgroundColor:'#F65008'}} disabled={loading} onClick={this.sendMessage}>Send Message</button>
                <button style={{backgroundColor:'#05AB8F'}} onClick={this.openModal}>Upload Media</button>

                <Modal
                    modal={modal}
                    closeModal={this.closeModal}
                    uploadFile={this.uploadFile}/>
            </div>
        )
    }
}

export default MessageForm;