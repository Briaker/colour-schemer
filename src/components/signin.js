import React from 'react';
import base from '../base';
import * as firebase from 'firebase';
import { Redirect } from 'react-router-dom'

// const dbRef = base.database().ref();

export default class SignIn extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.setMessage = this.setMessage.bind(this);

        this.state = {
            email: '',
            password: '',
            message: '',
            redirectToReferrer: false
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
                console.log('success!');
                this.setState({ redirectToReferrer: true });
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

    render() {
        const {from} = this.props.location.state || '/';
        const redirectToReferrer = this.state.redirectToReferrer;

        return (
            <div>
                {redirectToReferrer && (
                    <Redirect to={from}/>
                )}
                <div>{this.state.message}</div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" onChange={this.handleInput} value={this.state.email}/>

                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" onChange={this.handleInput} value={this.state.password}/>

                    <button>Sign in</button>
                </form>
                <h1>Sign in!</h1>
            </div>
        );
    }
}