import React from 'react';
import SignOut from './signout';
import * as firebase from 'firebase';
import { withRouter } from 'react-router-dom';
import { isAuthenticated } from '../../base';

class SignInForm extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.setMessage = this.setMessage.bind(this);
        this.displaySignInForm = this.displaySignInForm.bind(this);

        this.state = {
            email: '',
            password: '',
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
            firebase.auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((user) => {
                // const {from} = this.props.location.state || '/';
                this.props.history.push('/');
            })
            .catch((error) => {
                // Remote input validation
                if(error.code === `auth/invalid-email`) {
                    console.log(`Invalid Email!`);
                    this.setMessage(`Invalid Email!`);
                }
                else if(error.code === `auth/user-disabled`) {
                    this.setMessage(`Account is disabled!`);
                }
                else if(error.code === `auth/user-not-found` || error.code === `auth/wrong-password`) {
                    this.setMessage(`Wrong Password or Email!`);
                }
                else {
                    console.log(error.code);
                }
            });
        }
        
        
    }

    handleInput(event) {
        const input = event.target.value.trim();
        this.setState({
            [event.target.name]: input
        });
    }

    setMessage(text) {
        this.setState({
            message: text
        });
    }

    displaySignInForm() {
        const redirectToReferrer = this.state.redirectToReferrer;
        const {from} = this.props.location.state || '/';

        return (
            <div className="signInForm">
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" name="email" onChange={this.handleInput} value={this.state.email}/>

                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" onChange={this.handleInput} value={this.state.password}/>
                    </div>
                    <button>Sign In</button>
                    <div>{this.state.message}</div>
                </form>
            </div>
        );
    }

    render() {
        const content = (isAuthenticated()) ? (<SignOut />) : this.displaySignInForm();
        return (
            <div>{content}</div>
        );
    }
}

const SignInFormRouter = withRouter(SignInForm);

export default SignInFormRouter;