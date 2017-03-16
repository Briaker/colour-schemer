import React from 'react';
import base from '../base';
import * as firebase from 'firebase';
import { Redirect } from 'react-router'

const dbRef = base.database().ref();

export default class Messages extends React.Component {
    constructor() {
        super();
        this.displayMessages = this.displayMessages.bind(this);
    }

    displayMessages() {
        return (
            this.props.messages.map((message, i) => {
                if(message !== '') {
                    return (
                        <li key={`message-${i}`}>{message}</li>
                    );
                }
            })
        );
    }

    render() {
        return (
            <div>
                <ul className="messages">
                    {this.displayMessages()}
                </ul>
            </div>
        );
    }
}