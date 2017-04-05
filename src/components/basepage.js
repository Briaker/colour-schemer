import React from 'react';
import Header from './header';
import Footer from './footer';

export default class BasePage extends React.Component {

    constructor() {
        super();
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.displayModal = this.displayModal.bind(this);

        this.state = {
            showModal: false,
            modalTitle: '',
            modalMessage: '',
            modalAccept: '',
            modalCancel: '',
            modalCallback: null
        }
    }

    openModal(content, callback) {
        this.setState({
            showModal: true,
            modalCallback: callback || (() => {console.error('No callback provided')}),
            modalTitle: content.title || 'Alert!',
            modalMessage: content.message || 'No message provided',
            modalAccept: content.accept || 'OK',
            modalCancel: content.cancel || 'Cancel',
            isErrorMessage: content.isError || false
        });
    }

    closeModal() {
        this.setState({
            showModal: false,
            modalTitle: '',
            modalMessage: '',
            modalAccept: '',
            modalCancel: '',
            modalCallback: null,
            isErrorMessage: false
        });
    }

    static childContextTypes = {
        openModal: React.PropTypes.func,
        closeModal: React.PropTypes.func
    }

    getChildContext() {
        return {
            openModal: this.openModal,
            closeModal: this.closeModal,
        };
    }
    
    displayModal() {
        if(this.state.showModal) {
            const classes = `modal${this.state.isErrorMessage ? ' error' : ''}`
            return (
                <div className="lightBox">
                    <div className={classes}>
                        <h2>{this.state.modalTitle}</h2>
                        <p>{this.state.modalMessage}</p>
                        <div className="buttons">
                            <button className="acceptButton" onClick={this.state.modalCallback}>{this.state.modalAccept}</button>
                            <button className="cancelButton" onClick={this.closeModal}>{this.state.modalCancel}</button>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }

    render() { 
        return (
            <div className="fullBleedWrapper">
                {this.displayModal()}
                <Header {...this.props}/>
                
                <div className="wrapper">
                    <main>
                        {this.props.children || <h1>Error!</h1>}
                    </main>
                </div>

                <Footer />
            </div>
            
        );
    }
}

// Cant access context from Modal inside of props.children

// import React from 'react';
// import Modal from './modal';
// import Header from './header';
// import Footer from './footer';

// export default class BasePage extends React.Component {

//     render() { 
//         return (
//             <div className="fullBleedWrapper">
//                 <Modal />
//                 <Header {...this.props}/>
//                 <div className="wrapper">
//                     <main>
//                         {this.props.children || <h1>Error!</h1>}
//                     </main>
//                 </div>
//                 <Footer />
//             </div>
//         );
//     }
// }