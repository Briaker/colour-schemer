import React from 'react';
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
                <li><SignInForm {...this.props}/></li>
            </ul>
        :
            <ul>   
                <li><Link to="/">Home</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><SignInForm {...this.props}/></li>
            </ul>
        ;
        return (
            <header>
                <h1>Color Schemer</h1>
                
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