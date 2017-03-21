import React from 'react';
import Dropzone from 'react-dropzone';
import Scheme from './scheme';
import BasePage from './basepage';
import ColorThief from '../libraries/color-thief';
import { db, storage, auth } from '../base';
import { withRouter } from 'react-router-dom'

const storageRef = storage.ref();

class AddScheme extends React.Component {
    constructor() {
        super();
        this.onDrop = this.onDrop.bind(this);
        this.processImage = this.processImage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleChecked = this.handleChecked.bind(this);

        this.state = {
            schemeImageUrl: null,
            primaryColour: null,
            paletteColours: null,
            title: '',
            votes: 0,
            isPublic: false,
            path: null
        }
    }

    handleInput(event) {
        const input = event.target.value;
        this.setState({
            [event.target.name]: input
        });
    }

    handleChecked(event) {
        const checked = event.target.checked;
        this.setState({
            [event.target.name]: checked
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.context.uid && this.state.title) {

            const usersRef = db.ref(`users/${this.context.uid}`);
            const uesrSchemesRef = usersRef.child('schemes');

            const schemeRef = uesrSchemesRef.push({
                schemeImageUrl: this.state.schemeImageUrl,
                primaryColour: this.state.primaryColour,
                paletteColours: this.state.paletteColours,
                title: this.state.title,
                votes: this.state.votes,
                isPublic: this.state.isPublic
            });

            this.setState({
                path: `users/${this.context.uid}/schemes/${schemeRef.key}`
            });

            this.props.history.push(`users/${this.context.uid}/schemes/${schemeRef.key}`);
        }
    }

    onDrop(file) {
        const uploadTask = storageRef.child(`userImages/${this.context.uid}/${Date.now()}-${file[0].name}`).put(file[0]);
        
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);

            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }

        }, (error) => {
            console.log(`Upload error: ${error}`);
        }, () => {
           this.processImage(uploadTask.snapshot.downloadURL);
        });
    }

    processImage(url) {
        // Color Thief needs an html element object to process
        const image = document.createElement('img');

        // The image needs a height and width, any value seems to work
        image.setAttribute('width', '500');
        image.setAttribute('height', '500');

        // The image's url
        image.setAttribute('src', url);

        // In order for Image Thief to request images from firebase.storage,
        // this attribute is required, along with configuring the storage bucket to
        // allow CORS (cross origin resource sharing)
        image.crossOrigin = "Anonymous";

        image.addEventListener('load', () => {
            const colorThief = new ColorThief();
            const colour = colorThief.getColor(image);
            const palette = colorThief.getPalette(image, 6);
            this.setState({
                primaryColour: colour,
                paletteColours: palette,
                schemeImageUrl: url
            });
        });
    }

    render() {
        const scheme = (this.state) ? <Scheme schemeData={this.state} showCodes={true}/> : null;

        return (
            <div>
                <BasePage {...this.props}>
                    <h1>Drag Files here</h1>

                    <Dropzone onDrop={this.onDrop} multiple={false}>
                        <div>Try dropping some files here, or click to select files to upload.</div>
                    </Dropzone>

                    {scheme}

                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" onChange={this.handleInput} value={this.state.title}/>

                        <label htmlFor="isPublic">Searchable</label>
                        <input type="checkbox" name="isPublic" onChange={this.handleChecked} value={this.state.isPublic}/>

                        <button disabled={!this.state.title}>Save</button>
                    </form>

                </BasePage>
            </div>
        );
    }
}

AddScheme.contextTypes =  {
    uid: React.PropTypes.string
};

const AddSchemeRouter = withRouter(AddScheme);

export default AddSchemeRouter;