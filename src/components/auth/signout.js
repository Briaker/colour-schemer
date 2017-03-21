import React from 'react';
import * as firebase from 'firebase';
import { withRouter } from 'react-router-dom'

class SignOut extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setMessage = this.setMessage.bind(this);

        this.state = {
            message: ''
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const email = this.state.email;
        const password = this.state.password;

        // Local input validation
        if(email === '' || password === '') {
            this.setMessage(`Please fill out all fields!`);
        }
        else {
            firebase.auth().signOut()
            .then((user) => {
                console.log('success!');
                // this.props.history.push('/');
            })
            .catch((error) => {
                console.log(error.code);
            });
        }
    }

    setMessage(text) {
        this.setState({
            message: text
        });
    }

    render() {
        return (
            <div>
                <div>{this.state.message}</div>
                <form onSubmit={this.handleSubmit}>
                    <button>Sign out</button>
                </form>
            </div>
        );
    }
}

const SignOutRouter = withRouter(SignOut);

export default SignOutRouter;