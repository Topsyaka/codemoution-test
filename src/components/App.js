import React from 'react';
import { Link } from 'react-router';
import Invoices from './Invoices';


const navbarInstance = (
    <nav className="navbar navbar-toggleable-md navbar-light bg-faded" style={{marginBottom: '20px'}}>
        <a href="/" className="navbar-brand mb-0">MOCKUP</a>
    </nav>
);

export default class App extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                {navbarInstance}
                <main className="container">
                    {this.props.children}
                </main>
            </div>
        );
    }
}

