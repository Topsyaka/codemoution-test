import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { browserHistory, Link } from 'react-router'

export default class Invoices extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            invoices: [],
            customers: []
        }

        this.getData = this.getData.bind(this);
        this.renderInvoices = this.renderInvoices.bind(this);
    }

    createInvoice(){
        console.log('clicked');
        const invoice = {
            customer_id: '2',
            discount: 0,
            total: 0
        };
        const data = Object.keys(invoice).reduce((prevValue, key) => {
            return prevValue + decodeURIComponent(invoice[key])
        },'');

        fetch('/api/invoices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        })
            .then((response) => {
                if(response.status === 200){
                    return response.json();
                }
            })
            .then((invoice) => {
                if(invoice.id){
                    const path = `invoices/${invoice.id}`;
                    console.log(path);
                    browserHistory.push(path);
                }

            })
    }

    getData(){
        axios({
            method: 'get',
            url: '/api/invoices'
        })
            .then(response => {
                const invoices = response.data;
                this.setState({
                    invoices
                })
            })

        axios({
            method: 'get',
            url: '/api/customers'
        })
            .then(response => {
                const customers = response.data;
                this.setState({
                    customers
                })
            })

    }

    componentDidMount(){
        this.getData();
    }

    renderInvoices(invoice){
        const customer = this.state.customers.find(customer => invoice.customer_id == customer.id);

        return (
            <div className="card" key={invoice.id} style={{marginBottom: '20px'}}>
                <Link to={`/invoices/${invoice.id}`} className="card-header"><h5>Invoice #{invoice.id}</h5></Link>
                <div className="card-block">

                    <p>Customer: {customer?customer.name:''}</p>
                    <p>Total: {invoice.total}</p>
                    <p>Discount: {invoice.discount}</p>
                </div>
            </div>
        );
    }

    render(){
        return(
            <div className = "jumbotron">
                {this.state.invoices.map(this.renderInvoices)}
                <Button bsStyle="primary" bsSize="large" active onClick={this.createInvoice}>Create Invoice</Button>
            </div>
        )
    }
}