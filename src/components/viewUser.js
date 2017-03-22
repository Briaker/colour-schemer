import React from 'react';
import Scheme from './scheme';
import BasePage from './basepage';
import { db } from '../base';
import { withRouter } from 'react-router-dom'

class ViewUser extends React.Component {
    constructor() {
        super();
        this.state = {
            schemes: [],
            name: ''
        }
    }

    componentDidMount() {
        const userRef = db.ref(`users/${this.props.match.params.userId}`);

        if(userRef) {
            userRef.on('value', (data) => {
                console.log('user view update', data);
                const userProfile = data.val().profile;
                const userSchemes = data.val().schemes
                const schemes = [];
                for(let key in userSchemes) {
                    // TODO: Quick'n Dirty fix, need to change regex in scheme to accept any path, not just ones with /schemes/key at the end...
                    userSchemes[key].path = `users/${this.props.match.params.userId}/schemes/${key}`;
                    schemes.push(<Scheme key={key} schemeData={userSchemes[key]} showLink={true}/>);
                }

                this.setState({
                    schemes: schemes,
                    name: userProfile.name
                });
            });
        }
        else {
            this.props.history.push('/');
        }
        
    }

    render() {
        return (
            <BasePage {...this.props}>
                <h1>{this.state.name}</h1>
                <div className="schemesWrapper">
                    {this.state.schemes}
                </div>
            </BasePage>
        );
    }
}


const ViewUserRouter = withRouter(ViewUser);

export default ViewUserRouter;