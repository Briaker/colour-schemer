import React from 'react';
import { rgbToHsl, rgbToHex } from '../libraries/colour-converter';

export default class SchemePalette extends React.Component {
    constructor() {
        super();
        this.generateColourSample = this.generateColourSample.bind(this);
        this.displayPalette = this.displayPalette.bind(this);
    }

    generateColourSample(rgb, key) {
        const rgbCode = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
        const hexCode = rgbToHex(rgb[0], rgb[1], rgb[2]);
        const hslCode = rgbToHsl(rgb[0], rgb[1], rgb[2]);

        const hslFormatted = `${hslCode[0]}, ${hslCode[1]}, ${hslCode[2]}`;

        const style = {
          background: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
        };

        const codes = (this.props.showCodes) ? 
            <ul className="colourCodes">
                <li>RGB: {rgbCode}</li>
                <li>HEX: {hexCode}</li>
                <li>HSL: {hslFormatted}</li>
            </ul>
        : 
            null
        ;

        return (
            <div key={key} className="sample">
                <div className="sampleColour" style={style}>
                    {codes}
                </div>
            </div>
        );
    }

    displayPalette() {
        // const content = (isAuthenticated()) ? (<SignOut />) : this.displaySignInForm();
        if(this.props.schemeData.primaryColour && this.props.schemeData.paletteColours) {
            const samples = [];

            samples.push(this.generateColourSample(this.props.schemeData.primaryColour, 'primeColour-0'));
            this.props.schemeData.paletteColours.map((colour, i) => {
                samples.push(this.generateColourSample(colour, `paletteColour-${i}`));
            });

            return samples
        }
        else {
            return null;
        }
    }

    render() {
        return (
            <div className={`sampleWrapper ${this.props.showCodes? "fullView" : ""}`}>
                {this.displayPalette()}
            </div>
        );
    }
}

SchemePalette.contextTypes =  {
    uid: React.PropTypes.string
};
