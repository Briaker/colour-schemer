import React from 'react';
import { isAuthenticated, db } from '../base';

export default class SchemeControls extends React.Component {
    constructor() {
        super();
        this.handleChecked = this.handleChecked.bind(this);
        this.handleClicked = this.handleClicked.bind(this);
        this.displayControls = this.displayControls.bind(this);
    }


    handleChecked(event) {
        const dbRef = db.ref(this.props.schemeData.path);

        dbRef.update({
            isPublic: event.target.checked
        });
    }

    handleClicked(event) {
        const dbRef = db.ref(this.props.schemeData.path);

        dbRef.child('votes').once('value').then((data) => {
            const votes = data.val() + 1;
            dbRef.update({
                votes: votes
            });
        });
    }

    displayControls() {
        if(isAuthenticated()) {
            const userId = (this.props.schemeData.path) ? 
                this.props.schemeData.path.match('users\/(.*?)\/schemes')[1] 
            : 
                null
            ;

            const voteButton = (<button onClick={this.handleClicked}>{this.props.schemeData.votes}+</button>);

            const publicButton = (userId && this.context.uid && this.context.uid === userId) ? 
                <input type="checkbox" name="isPublic" onChange={this.handleChecked} checked={this.props.schemeData.isPublic}/>
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
    uid: React.PropTypes.string
};
