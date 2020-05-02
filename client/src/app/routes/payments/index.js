import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';

const ClientPage = ({match}) => (
  <div className="app-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`}/>
      <Route path={`${match.url}/list`} component={asyncComponent(() => import('./routes/List'))}/>
    </Switch>
  </div>
);

export default ClientPage;