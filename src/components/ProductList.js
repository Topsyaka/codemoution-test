import React from  'react';

export default class ProductList extends React.Component{
    constructor(props){
        super(props);

        this.renderListItem = this.renderListItem.bind(this);
    }

    renderListItem(addedProduct, index){
        const product = this.props.products.find((product) => {
            return (addedProduct.product_id == product.id)
        })
        return(
            <li key={index} className="list-group-item">
                <div className="col-md-10">{product.name}</div>
                <div className="col-md-2">
                    <input type="number" className="form-control" value={addedProduct.quantity} onChange={(e) => {this.props.handleChangeQuantity(e, index)}}/>
                </div>

            </li>
        );
    }

    render(){
        const addedProducts = this.props.addedProducts.splice();
        const products = this.props.products.splice();

        return(
            <ul className="list-group">
                {this.props.addedProducts.map(this.renderListItem)}
            </ul>
        )
    }
}