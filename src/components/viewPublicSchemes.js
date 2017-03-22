import React from 'react';

import Scheme from './scheme';
import { db } from '../base';

export default class ViewSchemes extends React.Component {
    constructor() {
        super();
        this.state = {
            schemes: []
        }
    }

    componentDidMount() {
        const dbRef = db.ref('/users')

        dbRef.on('value', (data) => {
            const schemesCollection = [];
            const users = data.val();

            for(let userKey in users) {
                const schemes = users[userKey].schemes

                for(let schemeKey in schemes) {
                    const schemeData = schemes[schemeKey];
                    schemeData.path = `users/${userKey}/schemes/${schemeKey}`;
                    if(schemeData.isPublic) {
                        schemesCollection.push(<Scheme key={schemeKey} schemeData={schemeData} showLink={true} />);
                    }
                }
            }

            this.setState({
                schemes: schemesCollection
            });
        });
    }

    render() {
        return (
            <div >
                <h1>View All Public Schemes</h1>
                <div className="schemesWrapper">
                    {this.state.schemes}
                </div>
            </div>
        );
    }
}
