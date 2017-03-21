import React from 'react';
import Scheme from './scheme';
import BasePage from './basepage';
import { db, storage } from '../base';

export default class ViewUser extends React.Component {
    constructor() {
        super();
        this.state = {
            schemes: []
        }
    }

    componentDidMount() {
        const userRef = db.ref(`users/${this.props.match.params.userId}`);

        userRef.on('value', (data) => {
            const userData = data.val().schemes;
            const schemes = [];
            for(let key in userData) {
                const primary = userData[key].primaryColour;
                const palette = userData[key].paletteColours;
                const url = userData[key].schemeImageUrl;
                schemes.push(<Scheme key={key} primaryColour={primary} paletteColours={palette} schemeImageUrl={url}/>);
            }

            this.setState({
                schemes: schemes
            });
        });
    }

    render() {
        return (
            <BasePage {...this.props}>
                <h1>View User</h1>
                <div className="schemesWrapper">
                    {this.state.schemes}
                </div>
            </BasePage>
        );
    }
}
