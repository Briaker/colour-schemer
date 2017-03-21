import React from 'react';
import BasePage from './basepage';

export default class EditScheme extends React.Component {
    render() {
        return (
            <div>
                <BasePage {...this.props}>
                    <h1>Editing happens here</h1>
                </BasePage>
            </div>
        );
    }
}