import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "../../util/asyncComponent";
import { withRouter } from "react-router";
import ClientPage from "./clients";
import ProductPage from './products'
import PaymentPage from './payments';

const Routes = ({ match }) =>
  <Switch>
       <Route path={`${match.url}/clients`} component={ClientPage} />
       <Route path={`${match.url}/products`} component={ProductPage} />
       <Route path={`${match.url}/payments`} component={PaymentPage} />
       <Route component={asyncComponent(() => import("app/routes/extraPages/routes/404"))}/>
  </Switch>;


export default withRouter(Routes);
