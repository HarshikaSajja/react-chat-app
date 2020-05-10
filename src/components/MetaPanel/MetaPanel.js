import React from 'react'
import './MetaPanel.css'

class MetaPanel extends React.Component {
    state = {
        privateChannel: this.props.isPrivateChannel,
        isPostersClicked: false,
        postersHidden: true,
        isAuthorClicked: false,
        authorHidden: true
    }

    toggleTopPosters = () => {
        this.setState({
            isPostersClicked: !this.state.isPostersClicked,
            postersHidden: !this.state.postersHidden
        })
    }

    toggleCreatedBy = () => {
        this.setState({
            isAuthorClicked: !this.state.isAuthorClicked,
            authorHidden: !this.state.authorHidden
        })
    }

    render() {
        console.log('isPrivateChannel?????',this.state.privateChannel)
        if(this.state.privateChannel) return null
        return (
            <div className="meta-panel-container">
                <div className="meta-box-container">
                    <div className="meta-box">
                        <h4>About #Channel</h4>
                        <hr/>
                        <div onClick={this.toggleTopPosters} className={this.state.isPostersClicked ? 'meta-title-expand' : 'meta-title-collapse'}>
                            <p>Top Posters</p>
                            <div hidden={this.state.postersHidden}>
                                <ul>
                                    <li>harshika</li>
                                    <li>tanvi</li>
                                    <li>azx</li>
                                </ul>
                            </div>
                        </div>
                        <hr/>
                        <div onClick={this.toggleCreatedBy} className={this.state.isAuthorClicked ? 'meta-title-expand' : 'meta-title-collapse'}>
                            <p>Created By</p>
                            <div hidden={this.state.authorHidden}>
                                <span>harshika</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MetaPanel;