import React from 'react';
import BasePage from './basepage';


export default class NoMatch extends React.Component {
    render() {
        return (
            <div>
                <BasePage {...this.props}>
                    <h1>Page Not Found!</h1>
                <BasePage />
            </div>
        );
    }
}