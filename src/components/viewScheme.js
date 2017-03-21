import React from 'react';
import BasePage from './basepage';
import Scheme from './scheme';
import { db } from '../base';

export default class ViewScheme extends React.Component {
    constructor() {
        super();
        this.state = {
            primaryColour: null,
            paletteColours: null,
            schemeImageUrl: null
        }
    }

    componentDidMount() {
        const userSchemesRef = db.ref(`users/${this.props.match.params.userId}/schemes/${this.props.match.params.schemeId}`);

        userSchemesRef.on('value', (data) => {
            const schemeData = data.val();
            this.setState({
                primaryColour: schemeData.primaryColour,
                paletteColours: schemeData.paletteColours,
                schemeImageUrl: schemeData.schemeImageUrl,
                path: `users/${this.props.match.params.userId}/schemes/${this.props.match.params.schemeId}`
            });
        });
    }

    render() {
        const primary = this.state.primaryColour;
        const palette = this.state.paletteColours;
        const url = this.state.schemeImageUrl;
        return (
            <BasePage {...this.props}>
                <Scheme schemeData={this.state} />
            </BasePage>
        );
    }
}
