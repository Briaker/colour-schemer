import React from 'react';
import SchemeControls from './schemeControls'
import SchemePalette from './schemePalette'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../base';

export default class Scheme extends React.Component {
    constructor() {
        super();
        this.displayScheme = this.displayScheme.bind(this);
    }

    displayScheme() {
        if(this.props.schemeData.primaryColour && this.props.schemeData.paletteColours) {
            const imageWrapper = (
                <div className="imageWrapper">
                    <img src={this.props.schemeData.schemeImageUrl} alt=""/>
                </div>
            );

            const image = (this.props.showLink) ? 
                (<Link to={this.props.schemeData.path || "/"}>
                    {imageWrapper}
                </Link>)
            : 
                <div>
                    {imageWrapper}
                </div>
            ; 
            return (
                <div className="schemeWrapper">
                        <SchemeControls {...this.props}/>
                        {image}
                        <SchemePalette {...this.props}/>
                </div>
            );
        }
        else {
            return null;
        }
    }

    render() {
        return (
            <div>
                {this.displayScheme()}
            </div>
        );
    }
}

Scheme.contextTypes =  {
    uid: React.PropTypes.string
};
