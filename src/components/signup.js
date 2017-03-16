import React from 'react';
import base from '../base';
import * as firebase from 'firebase';
import { withRouter } from 'react-router-dom'

// const dbRef = base.database().ref();

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

        const email = this.state.email;
        const name = this.state.name;
        const password = this.state.password;
        const confirm = this.state.confirm;

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
                // console.log('success!');
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
            console.log(this.state.messages);
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
        return (
            <div>
                <div>{this.state.message}</div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" onChange={this.handleInput} value={this.state.email}/>

                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" onChange={this.handleInput} value={this.state.name}/>

                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" onChange={this.handleInput} value={this.state.password}/>

                    <label htmlFor="confirm">Confirm</label>
                    <input type="password" name="confirm" onChange={this.handleInput} value={this.state.confirm}/>
                    <button>Sign up</button>
                </form>
                <h1>Sign up!</h1>
            </div>
        );
    }
}

const SignUpRouter = withRouter(SignUp);

export default SignUpRouter;