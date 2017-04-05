import React from 'react';
import Dropzone from 'react-dropzone';
import Scheme from './scheme';
import BasePage from './basepage';
import ColorThief from '../libraries/color-thief';
import jic from '../libraries/JIC.min';
import { db, storage, auth } from '../base';
import { withRouter } from 'react-router-dom'

const storageRef = storage.ref();

class AddScheme extends React.Component {
    constructor() {
        super();
        this.onDrop = this.onDrop.bind(this);
        this.processImage = this.processImage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.dataURItoBlob = this.dataURItoBlob.bind(this);
        this.deleteImage = this.deleteImage.bind(this);

        this.schemeSaved = false;

        this.state = {
            schemeImageUrl: null,
            dbImagePath: null,
            primaryColour: null,
            paletteColours: null,
            title: '',
            votes: 0,
            isPublic: false,
            path: null,
            dropZoneClass: 'dropZone',
            progress: 0
        }
    }

    componentWillUnmount() {
        if(!this.schemeSaved && this.state.dbImagePath) {
            this.deleteImage();
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
        console.log('SUBMIT!');
        event.preventDefault();
        if(this.context.uid && this.state.title) {
            schemeSaved = true;
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

    deleteImage() {
        if(this.state.dbImagePath) {
            const imageRef = storage.ref(this.state.dbImagePath);

            imageRef.delete()
            .then(() => {
                console.log('Image deleted!')
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    handleCancel(event) {
        event.preventDefault();
        console.log('cancel');
        this.props.history.push('/');
    }

    // TODO: Move to helper file
    // credit: http://stackoverflow.com/a/7261048
    dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], {type: mimeString});
    }

    onDrop(file) {
        const image = new Image;
        const originImage = document.createElement('img');
        let compressedData = null;

        image.onload = () => {
            originImage.setAttribute('src', image.src);
            compressedData = this.dataURItoBlob(jic.compress(originImage,80,'jpg').src);
            const fileName = `${Date.now()}-${file[0].name}`;
            const dbImagePath = `userImages/${this.context.uid}/${fileName}`;

            const uploadTask = storageRef.child(dbImagePath).put(compressedData);
            
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.setState({
                    progress: progress
                });
            }, (error) => {
                console.log(`Upload error: ${error}`);
            }, () => {
                this.processImage(uploadTask.snapshot.downloadURL, dbImagePath);
                window.URL.revokeObjectURL(image.src);
            });
        }
        image.src = window.URL.createObjectURL(file[0]);
    }

    processImage(url, dbImagePath) {
        // Color Thief needs an html element object to process
        const image = document.createElement('img');

        // The image needs a height and width, any value seems to work
        image.setAttribute('width', '500');
        image.setAttribute('height', '500');

        // The image's url
        image.setAttribute('src', url);

        // In order to request images from firebase.storage,
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
                schemeImageUrl: url,
                dbImagePath: dbImagePath,
                dropZoneClass: "dropZone hidden"
            });
            console.log(this.state.dbImagePath);
        });

    }

    render() {
        const scheme = (this.state) ? <Scheme schemeData={this.state} showCodes={true} hideControls={true}/> : null;
        const progressClasses = (this.state.progress > 0) ? "progressWrapper visible" : "progressWrapper";
        return (
            <div>
                <BasePage {...this.props}>
                    <h1>Drag Files here</h1>

                    <Dropzone onDrop={this.onDrop} multiple={false} className={this.state.dropZoneClass} activeClassName="dropZoneActive">
                        <div className="uploadIcon"></div>
                        <div className="text">Drag and drop your image here!</div>
                        <div className={`${progressClasses}`}>
                            <div className="progress" style={{width:`${this.state.progress}%`}}></div>
                        </div>
                    </Dropzone>
                    {scheme}
                    <img id="compressedImage" alt=""/>

                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" onChange={this.handleInput} value={this.state.title}/>
                        <div className="inputWrapper">
                            <label htmlFor="isPublic">Searchable</label>
                            <input type="checkbox" name="isPublic" id="isPublic" onChange={this.handleChecked} checked={this.state.isPublic}/>
                        </div>

                        <button disabled={!this.state.title}>Save</button>
                        <button onClick={this.handleCancel}>Cancel</button>
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