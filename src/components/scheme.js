import React from 'react';
import { Link } from 'react-router-dom';

export default class Scheme extends React.Component {
    constructor() {
        super();
        this.generateColourSample = this.generateColourSample.bind(this);
        this.displayColourSamples = this.displayColourSamples.bind(this);
    }

    generateColourSample(rgb, key) {
        const style = {
          background: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
        };

        return (
            <div className="sample" key={key} style={style}></div>
        );
    }

    displayColourSamples() {
        if(this.props.schemeData.primaryColour && this.props.schemeData.paletteColours) {
            const samples = [];
            samples.push(this.generateColourSample(this.props.schemeData.primaryColour, 'primeColour-0'));
            this.props.schemeData.paletteColours.map((colour, i) => {
                samples.push(this.generateColourSample(colour, `paletteColour-${i}`));
            });
            return (
                <div className="schemeWrapper">
                    <Link to={this.props.schemeData.path}>
                        <div className="imageWrapper">
                            <img src={this.props.schemeData.schemeImageUrl} alt=""/>
                        </div>
                        <div className="sampleWrapper">
                            {samples}
                        </div>
                    </Link>
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
                {this.displayColourSamples()}
            </div>
        );
    }
}
