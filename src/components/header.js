import React from 'react';
import SignInForm from './auth/signinform';
import { Link } from 'react-router-dom';

export default class Header extends React.Component {
    render() {
        return (
            <header>
                <h1>Color Schemer</h1>
                
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/users/voPr8pzilISfaOTnZLXiqYXkAg23/schemes/-Kfh46yf30XteqUtH7nq">Edit/View</Link></li>
                        <li><Link to="/users/voPr8pzilISfaOTnZLXiqYXkAg23">User</Link></li>
                        <li><Link to="/add">Add</Link></li>
                        <li><Link to="/signup">SignUp</Link></li>
                        <li><SignInForm {...this.props}/></li>
                    </ul>
                </nav>
            </header>
        );
    }
}