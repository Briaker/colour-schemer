import React from 'react';
import BasePage from './basepage';
import ViewPublicSchemes from './viewPublicSchemes';

export default class App extends React.Component {

    render() {
        return (
            <div>
                <BasePage {...this.props}>
                    <ViewPublicSchemes />
                </BasePage>
            </div>
        );
    }
}