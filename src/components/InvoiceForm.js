import React from 'react';
import ProductList from './ProductList';
import ModalCustomer from './ModalCustomer';
import axios from 'axios';
import { Link } from 'react-router';


export default class InvoiceFrom extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            products: [],
            customers: [],
            total: 0,
            discount: 0,
            addedProducts: [],
            customer_id: 0,
            displayStyle: false,
        };

        this.getInvoiceData = this.getInvoiceData.bind(this);
        this.getAllData = this.getAllData.bind(this);
        this.sendData = this.sendData.bind(this);
        this.hadleChangeDiscount = this.hadleChangeDiscount.bind(this);
        this.addProductToList = this.addProductToList.bind(this);
        this.handleChangeAddedProduct = this.handleChangeAddedProduct.bind(this);
        this.countTotal = this.countTotal.bind(this);
        this.handleChangeCustomer = this.handleChangeCustomer.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.addNewCustomer = this.addNewCustomer.bind(this);
    }

    getInvoiceData(){
        axios({
            method: 'get',
            url: `/api/invoices/${this.props.params.invoiceId}`
        })
            .then((response) => {
                const data = response.data;

                this.setState((currentState) => {
                    currentState.discount = data.discount || 0;
                    currentState.customer_id = data.customer_id || 1;
                    currentState.total = data.total || 0;

                    return currentState;
                })
            })
            .then(error => {
                console.log(error);
            })
    }

    getAllData(){
        axios({
            method: 'get',
            url: '/api/products'
        })
            .then(response => {
                const products = response.data;
                this.setState({
                    products
                })
            })

        axios({
            method: 'get',
            url: '/api/customers'
        })
            .then(response => {
                this.setState({
                    customers: response.data
                })
            })

        axios({
            method: 'get',
            url: `/api/invoices/${this.props.params.invoiceId}/items`
        })
            .then(response => {
                const addedProducts = response.data;
                this.setState({
                    addedProducts
                })
                
            })
    }

    sendData(){
        axios({
            method: 'put',
            url: `/api/invoices/${this.props.params.invoiceId}`,
            data: {
                'customer_id': this.state.customer_id,
                'discount': this.state.discount,
                'total': this.state.total
            }
        })
            .then(response => {
                console.log(response);
            });
        this.state.addedProducts.forEach((item) => {
            if(!item.id){
                axios({
                    method: 'post',
                    url: `/api/invoices/${this.props.params.invoiceId}/items`,
                    data: {
                        'product_id': item.product_id,
                        'quantity': item.quantity
                    }
                })
                    .then(response => {
                        console.log(response)
                    })
            }else{
                axios({
                    method: 'put',
                    url: `/api/invoices/${this.props.params.invoiceId}/items/${item.id}`,
                    data: {
                        'product_id': item.product_id,
                        'quantity': item.quantity
                    }
                })
                    .then(response => {
                        console.log(response)
                    })
            }
        })

    }

    renderOption(item){
        return (
            <option key={item.id} value={item.id}>{item.name}    {item.price?item.price:''}</option>
        )
    }

    componentDidMount(){
        this.getInvoiceData();
        this.getAllData();
    }

    componentWillUnmount(){
        this.sendData();
    }

    hadleChangeDiscount(e){
        const discount = e.target.value;
        this.setState({
            discount
        }, () => {
            this.countTotal();
        })
    }

    addProductToList(){
        const productId = this.selectedProduct.value;
        const addedProducts = this.state.addedProducts.slice();
        const foundProductIndex = addedProducts.findIndex(product => {
            return product.product_id == productId;
        });

        if(foundProductIndex === -1){
            addedProducts.push({
                id: 0,
                invoice_id: this.props.params.invoiceId,
                product_id: productId,
                quantity: 1
            })
        }else{
            addedProducts[foundProductIndex].quantity++;
            console.log(addedProducts[foundProductIndex].quantity)
        }

        this.setState({
            addedProducts
        }, () => {
            this.countTotal();
        })
    }

    handleChangeAddedProduct(e, index){
        const addedProducts = this.state.addedProducts.slice();

        addedProducts[index].quantity = +e.target.value;

        this.setState({
            addedProducts
        }, () => {
            this.countTotal();
        })
    }

    handleChangeCustomer(e){
        const customer_id = e.target.value

        this.setState({
            customer_id
        })
    }

    countTotal(){
        const products = this.state.products;
        const discount = this.state.discount;
        const totalProductPrice = this.state.addedProducts.reduce((prevValue, item) => {
            return prevValue + (item.quantity*parseFloat(products.find(product => product.id == item.product_id).price))
        }, 0)

        const total = totalProductPrice - (totalProductPrice * parseFloat(discount)/100)
        this.setState({
            total
        });
    }

    toggleVisibility(){
        this.setState({
            displayStyle: !this.state.displayStyle
        })
    }

    addNewCustomer(data){
        axios({
            method: 'post',
            url: '/api/customers',
            data: data
        })
            .then(response => {
                const newCustomer = response.data;
                const customers = this.state.customers;

                customers.push(newCustomer);
                this.setState({
                    customers
                })
            })
    }

    render(){

        return(
            <div className="row">
                <div className="col">

                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group row">
                            <div className="col-md-10">
                                <label htmlFor="">Products</label>
                                <select className="form-control" ref={input => this.selectedProduct = input}>
                                    {this.state.products.map(this.renderOption)}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <button type="button" className="btn btn-primary" onClick={this.addProductToList}>Add product</button>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-10">
                                <label htmlFor="">Customers</label>
                                <select className="form-control" value={this.state.customer_id} onChange={this.handleChangeCustomer}>
                                    {this.state.customers.map(this.renderOption)}
                                </select>
                                <div style={{marginTop: '10px'}}>
                                    <button className="btn btn-primary" onClick={this.toggleVisibility}>Add new customer</button>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Discount</label>
                            <input type="number" onChange={this.hadleChangeDiscount} className="form-control col-md-10" value={this.state.discount}/>
                        </div>
                    </form>
                    <div className="jumbotron">
                        <ProductList
                            addedProducts = {this.state.addedProducts}
                            products = {this.state.products}
                            handleChangeQuantity = {this.handleChangeAddedProduct}
                            countTotal = {this.countTotal}
                        />
                        <p className="h6" style={{marginTop: '20px'}}>Total: {this.state.total}</p>
                    </div>
                    <ModalCustomer
                        displayStyle={this.state.displayStyle}
                        toggleVisibility={this.toggleVisibility}
                        customers = {this.state.customers}
                        addNewCustomer = {this.addNewCustomer}
                    />
                    <Link to="/">Back to List</Link>
                </div>
            </div>
        );
    }

}