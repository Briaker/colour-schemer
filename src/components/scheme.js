import React from 'react';
import SchemeControls from './schemeControls'
import SchemePalette from './schemePalette'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../base';

export default class Scheme extends React.Component {
    render() {
        if(this.props.schemeData.primaryColour && this.props.schemeData.paletteColours) {
            const classes = `schemeWrapper${this.props.listView ? " listView" : "" }`;

            const imageWrapper = (
                <div className="imageWrapper">
                    <img src={this.props.schemeData.schemeImageUrl} alt=""/>
                </div>
            );

            const image = (this.props.showLink) ? 
                (<Link to={`/${this.props.schemeData.path}` || "/"}>
                    {imageWrapper}
                </Link>)
            : 
                <div>
                    {imageWrapper}
                </div>
            ; 
            return (
                <div className={classes}>
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
}