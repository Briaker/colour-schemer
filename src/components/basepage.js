import React from 'react';
import Header from './header';
import Footer from './footer';

export default class BasePage extends React.Component {
    render() { 
        return (
            <div className="wrapper">
                <Header {...this.props}/>
                <main>
                    {this.props.children || <h1>Error!</h1>}
                </main>
                <Footer />
            </div>
        );
    }
}