import React from 'react';
import Header from './header';
import Footer from './footer';

export default class BasePage extends React.Component {
    render() { 
        return (
            <div className="fullBleedWrapper">
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