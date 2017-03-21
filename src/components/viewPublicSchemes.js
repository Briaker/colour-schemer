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
        const schemesCollection = [];

        dbRef.on('value', (data) => {
            const users = data.val();

            for(let userKey in users) {
                const schemes = users[userKey].schemes

                for(let schemeKey in schemes) {
                    const schemeData = schemes[schemeKey];
                    if(schemeData.isPublic) {
                        const primary = schemeData.primaryColour;
                        const palette = schemeData.paletteColours;
                        const url = schemeData.schemeImageUrl;

                        schemesCollection.push(<Scheme key={schemeKey} primaryColour={primary} paletteColours={palette} schemeImageUrl={url}/>);
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
                <h1>View All Shared Schemes</h1>
                <div className="schemesWrapper">
                    {this.state.schemes}
                </div>
            </div>
        );
    }
}
