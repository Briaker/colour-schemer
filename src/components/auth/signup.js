import React from 'react';
import BasePage from '../basepage';
import * as firebase from 'firebase';
import { db, auth } from '../../base';
import { withRouter } from 'react-router-dom'

class SignUp extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.setMessage = this.setMessage.bind(this);

        this.state = {
            email: '',
            name: '',
            password: '',
            confirm: '',
            message: ''
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const email = this.state.email.trim();
        const name = this.state.name.trim();
        const password = this.state.password.trim();
        const confirm = this.state.confirm.trim();

        // Local input validation
        if(email === '' || name === '' || password === '' || confirm === '') {
            this.setMessage(`Please fill out all fields!`);
        }
        else if(this.state.password !== this.state.confirm) {
            this.setMessage(`Passwords don't match!`);
        }
        else {
            firebase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((user) => {
                const usersProfileRef = db.ref(`users/${user.uid}/profile`);

                usersProfileRef.set({
                    name: name
                });

                this.props.history.push('/');
            })
            .catch((error) => {
                // Remote input validation
                if(error.code === `auth/invalid-email`) {
                    console.log(`Invalid Email!`);
                    this.setMessage(`Invalid Email!`);
                }
                else if(error.code === `auth/email-already-in-use`) {
                    this.setMessage(`Email already in use!`);
                }
                else if(error.code === `auth/weak-password`) {
                    this.setMessage(`Password is too weak!`);
                }
                else if(error.code === `auth/operation-not-allowed`) {
                    this.setMessage(`Signup is disabled at this time.`);
                }
                else {
                    console.log(error.code);
                }
            });
        }
    }
    
    handleInput(event) {
        const input = event.target.value;
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
        return (
            <BasePage {...this.props}>
                <h1>Sign up!</h1>
                <div>{this.state.message}</div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" onChange={this.handleInput} value={this.state.email}/>

                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name"  onChange={this.handleInput} value={this.state.name}/>

                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" onChange={this.handleInput} value={this.state.password}/>

                    <label htmlFor="confirm">Confirm</label>
                    <input type="password" name="confirm" id="confirm" onChange={this.handleInput} value={this.state.confirm}/>
                    <button>Sign up</button>
                </form>
            </BasePage>
        );
    }
}

const SignUpRouter = withRouter(SignUp);

export default SignUpRouter;