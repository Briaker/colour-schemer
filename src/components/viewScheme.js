import React from 'react';
import BasePage from './basepage';
import Scheme from './scheme';
import { db } from '../base';

export default class ViewScheme extends React.Component {
    constructor() {
        super();
        this.userSchemesRef = null;
        this.state = {
            primaryColour: null,
            paletteColours: null,
            schemeImageUrl: null,
            isPublic: null,
            path: null,
            votes: null
        }
    }

    componentDidMount() {
        this.userSchemesRef = db.ref(`users/${this.props.match.params.userId}/schemes/${this.props.match.params.schemeId}`);

        this.userSchemesRef.on('value', (data) => {
            const schemeData = data.val();
            this.setState({
                primaryColour: schemeData.primaryColour,
                paletteColours: schemeData.paletteColours,
                schemeImageUrl: schemeData.schemeImageUrl,
                isPublic: schemeData.isPublic,
                path: `users/${this.props.match.params.userId}/schemes/${this.props.match.params.schemeId}`,
                votes: schemeData.votes
            });
        });
    }

    componentWillUnmount() {
        this.userSchemesRef.off();
    }

    render() {
        const primary = this.state.primaryColour;
        const palette = this.state.paletteColours;
        const url = this.state.schemeImageUrl;
        return (
            <BasePage {...this.props}>
                <Scheme schemeData={this.state} showCodes={true}/>
            </BasePage>
        );
    }
}
