import React from 'react';
import { isAuthenticated, db, storage } from '../base';

export default class SchemeControls extends React.Component {
    constructor() {
        super();
        this.handleShare = this.handleShare.bind(this);
        this.handleVote = this.handleVote.bind(this);
        this.displayControls = this.displayControls.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.deleteCallback = this.deleteCallback.bind(this);
    }

    handleShare(event) {
        const dbRef = db.ref(this.props.schemeData.path);

        dbRef.update({
            isPublic: event.target.checked
        });
    }

    handleVote(event) {
        const dbRef = db.ref(this.props.schemeData.path);

        dbRef.child('votes').once('value').then((data) => {
            const votes = data.val() + 1;
            dbRef.update({
                votes: votes
            });
        });
    }

    handleOpenModal(event) {
        this.context.openModal({
            title: 'Delete Scheme?', 
            message: 'After you delete this, it can\'t be recovered.', 
            accept: 'Delete',
            isError: true
        }, 
            this.deleteCallback
        );
    }

    deleteCallback() {
        if(this.props.schemeData.path && this.props.schemeData.schemeImageUrl) {

            const uri = this.props.schemeData.schemeImageUrl;

            // Split image url into parts, and get path from last part without params
            const parts = uri.split('/');
            const path = parts[parts.length - 1].split('?')[0].replace(/%2F/g, '/');

            const schemeRef = db.ref(this.props.schemeData.path);
            const imageRef = storage.ref(path);

            schemeRef.remove()
            // .then(() => {
            //     console.log('Scheme deleted!');
            // })
            .catch((error) => {
                console.log(error);
            });

            imageRef.delete()
            // .then(() => {
            //     console.log('Image deleted!');
            // })
            .catch((error) => {
                console.log(error);
            });
        }
        this.context.closeModal();
    }

    displayControls() {
        if(isAuthenticated() && !this.props.hideControls) {
            const userId = (this.props.schemeData.path) ? 
                this.props.schemeData.path.match('users\/(.*?)\/schemes')[1] 
            : 
                null
            ;

            const voteButton = (<button className="voteBtn" onClick={this.handleVote}>{this.props.schemeData.votes}+</button>);
            const uniqueId = `isPublic-${Date.now()}`;
            const publicButton = (userId && this.context.uid && this.context.uid === userId) ? 
                <div className="userControls">
                    <div className="checkBox">
                        <input type="checkbox" name="isPublic" id={uniqueId} onChange={this.handleShare} checked={this.props.schemeData.isPublic}/>
                        <label htmlFor={uniqueId}></label>
                    </div>
                    <button className="deleteBtn" onClick={this.handleOpenModal}>X</button>
                </div>
            : 
                null
            ;

            return (
                <div className="schemeControls">
                    {voteButton}
                    {publicButton}
                </div>
            );
        }
        else {
            return null;
        }
        
    }

    render() {
        return (
            <div>
                {this.displayControls()}
            </div>
        );
    }
}

SchemeControls.contextTypes =  {
    uid: React.PropTypes.string,
    openModal: React.PropTypes.func,
    closeModal: React.PropTypes.func
};
