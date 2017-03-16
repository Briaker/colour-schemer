import React from 'react';
import ReactDOM from 'react-dom';

import { isAuthenticated, auth, db, storageKey } from './base';
import Header from './components/header';
import App from './components/app';
import SignUp from './components/signup';
import SignIn from './components/signin';
import SignOut from './components/signout';
import NoMatch from './components/no-match';
import Footer from './components/footer';

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

    render() {
        return (
            <Router>
                <div>
                    <Header />
                    <Switch>
                        <Route exact path="/" component={App} />
                        <Route path="/signup" component={SignUp} />
                        <Route path="/signin" component={SignIn} />
                        <PrivateRoute path="/signout" component={SignOut} />
                        <Route component={NoMatch}/>
                    </Switch>
                    <Footer />
                </div>
            </Router>
        );
    }
}

// If the user is authenticaded, then render the protected component, otherwise redirect to the signin page
const PrivateRoute = ({ component, ...rest }) => (
    <Route {...rest} render={ props => (
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

ReactDOM.render(<Root />, document.getElementById('main'));