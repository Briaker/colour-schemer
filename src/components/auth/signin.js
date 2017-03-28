import React from 'react';
import BasePage from '../basepage';
import SignInForm from './signinform';

export default class SignIn extends React.Component {
    render() {
        return (
            <div>
                <BasePage {...this.props}>
                    <h1>Sign in</h1>
                    <SignInForm {...this.props}/>
                </BasePage>
            </div>
        );
    }
}