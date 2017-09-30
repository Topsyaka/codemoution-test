import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Router, browserHistory, IndexRoute} from 'react-router';

import App from './components/App';
import Invoices from './components/Invoices';
import InvoiceForm from './components/InvoiceForm';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Invoices}></IndexRoute>
            <Route path="/invoices/:invoiceId" component={InvoiceForm}></Route>
        </Route>
    </Router>,
document.getElementById('root'));
