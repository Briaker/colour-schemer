import React from 'react';
import * as firebase from 'firebase';
import { withRouter } from 'react-router-dom'

class SignOut extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        firebase.auth().signOut()
        .then((user) => {
            this.props.history.push('/');
        })
        .catch((error) => {
            console.log(error.code);
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleSubmit}>Sign out</button>
            </div>
        );
    }
}

const SignOutRouter = withRouter(SignOut);

export default SignOutRouter;