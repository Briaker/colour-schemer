// Author: Brian Baker
// Project 6: Colour Schemer
// Users, onces registered, can upload images from their computers and save them to their account.
// The images are processed and the most prominent colours are extracted and the RGB, HEX, and HSL values
// are displayed.

// ***NOTE: voting is currently just a click counter***

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';
import SignUp from './components/auth/signup';
import SignIn from './components/auth/signin';
import AddScheme from './components/addScheme';
import ViewScheme from './components/viewScheme';
import ViewUser from './components/viewUser';
import EditScheme from './components/editScheme';
import NoMatch from './components/no-match';
import Footer from './components/footer';

import { isAuthenticated, auth, db, storageKey } from './base';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';

class Root extends React.Component {
    constructor() {
        super();
        this.state = {
            uid: null
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log('User found!');
                window.localStorage.setItem(storageKey, user.uid);
                this.setState({
                    uid: user.uid
                });
            } else {
                console.log('NO user found!');
                window.localStorage.removeItem(storageKey);
                this.setState({
                    uid: null
                });
            }
        });
    }

    static childContextTypes = {
        uid: React.PropTypes.string
    }

    getChildContext() {
        return {
            uid: this.state.uid
        };
    }

    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={App} />
                        <Route path="/signup" component={SignUp} />
                        <Route path="/signin" component={SignIn} />
                        <Route path="/users/:userId/schemes/:schemeId" component={ViewScheme} />
                        <Route path="/users/:userId" component={ViewUser} />
                        <PrivateRoute path="/add" component={AddScheme} />
                        <PrivateRoute path="/edit/:id" component={EditScheme} />
                        <Route component={NoMatch}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

// If the user is authenticaded, then render the protected component, otherwise redirect to the signin page
const PrivateRoute = ({ component, ...rest }) => {
    return (
        <Route {...rest} render={ (props) => (
            isAuthenticated() ? (
                React.createElement(component, props)
            ) : (
                <Redirect to={{
                    pathname: '/signin',
                    state: { from: props.location }
                }}/>
            )
        )}/>
    );
};

ReactDOM.render(<Root />, document.getElementById('main'));