import React from 'react';
import SignOut from './auth/signout';
import SignInForm from './auth/signinform';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../base';

export default class Header extends React.Component {
    render() {
        const navLinks = (isAuthenticated()) ? 
            <ul>   
                <li><Link to="/">Home</Link></li>
                <li><Link to={`/users/${this.context.uid}`}>User</Link></li>
                <li><Link to="/add">Add</Link></li>
                <li><SignOut /></li>
            </ul>
        :
            <ul>   
                <li><Link to="/">Home</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/signin">Sign In</Link></li>
            </ul>
        ;
        return (
            <header>
                <img className="logo" src="/assets/images/logo.png" alt=""/>
                
                <nav>
                    {navLinks}
                </nav>
            </header>
        );
    }
}

Header.contextTypes =  {
    uid: React.PropTypes.string
};