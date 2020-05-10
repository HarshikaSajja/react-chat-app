import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import mime from 'mime-types'

const style = {
    upload: {
     background: '#37B903',
     opacity: '0.8'
    },
    discard: {
     background: '#EA5A46',
     opacity: '0.8'
    },
    input: {
        marginLeft: '10px',
        marginBottom: '10px'
    },
    dialogContainer: {
        backgroundColor: 'rgba(204,204,204,0.6)',
    }
 };

class Modal extends React.Component {
    state = {
        file: null,
        valid: ['image/jpeg', 'image/png']
    }

    addFile = (event) => {
        const file = event.target.files[0]
        if(file) {
            this.setState({ file: file})
        }
    }

    sendFile = () => {
        if(this.state.file !== null) {
            if(this.isValid(this.state.file.name)){
                const metaData = {contentType: mime.lookup(this.state.file.name)}
                this.props.uploadFile(this.state.file, metaData)
                this.props.closeModal();
                this.clearFile()
            }
        }
    }

    clearFile = () => this.setState({ file: null })

    isValid = filename => this.state.valid.includes(mime.lookup(filename))

    render() {
        const {classes} = this.props;
        const { modal, closeModal } = this.props

        return (
            <Dialog
                className={classes.dialogContainer}
                open={modal}
                onClose={closeModal}>

                    <DialogTitle>{"Select an image file"}</DialogTitle>
                    <input
                        className={classes.input}
                        onChange={this.addFile}
                        accept="image/jpeg', 'image/png"
                        type="file"
                    />
                    <DialogActions>
                        <Button onClick={this.sendFile} variant="contained"  className={classes.upload}>
                            upload
                        </Button>
                        <Button onClick={closeModal} variant="contained" className={classes.discard}>
                            discard
                        </Button>
                    </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(style)(Modal);