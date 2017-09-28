import React from 'react';

export default class ModalCustomer extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            newCustomer: {
                name: '',
                address: '',
                phone: ''
            }
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.addNewCustomer = this.addNewCustomer.bind(this);
    }

    changeHandler(e){
        const newCustomer = this.state.newCustomer;
        const field = e.target.name;
        const value = e.target.value;

        newCustomer[field] = value;

        this.setState({
            newCustomer
        })
    }

    addNewCustomer(){
        this.props.addNewCustomer(this.state.newCustomer);
        this.state.newCustomer = {};
        this.props.toggleVisibility();

    }

    render(){
        return(
            <div className={`modal ${this.props.displayStyle?'':'fade'}`} style={this.props.displayStyle?{display: 'block'}:{display: 'none'}}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New customer</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.toggleVisibility}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <input required={true} type="text" className="form-control" placeholder="Name" name="name" onChange={this.changeHandler}/>
                                </div>
                                <div className="form-group">
                                    <input required={true} type="text" className="form-control" name="address" placeholder="Address" onChange={this.changeHandler}/>
                                </div>
                                <div className="form-group">
                                    <input required={true} type="text" className="form-control" name="phone" placeholder="Phone" onChange={this.changeHandler}/>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.addNewCustomer}>Save changes</button>
                            <button type="button" className="btn btn-secondary" onClick={this.props.toggleVisibility}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}