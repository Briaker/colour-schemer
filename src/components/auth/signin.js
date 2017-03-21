import React from 'react';
import BasePage from '../basepage';
import SignInForm from './signinform';

export default class SignIn extends React.Component {
    render() {
        return (
            <div>
                <BasePage {...this.props}>
                    <SignInForm {...this.props}/>
                </BasePage>
            </div>
        );
    }
}