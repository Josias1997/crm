import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';

const ClientPage = ({match}) => (
  <div className="app-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`}/>
      <Route path={`${match.url}/list`} component={asyncComponent(() => import('./routes/List'))}/>
      <Route path={`${match.url}/edit/:id`} component={asyncComponent(() => import('./routes/EditClient'))}/>
      <Route path={`${match.url}/add`} component={asyncComponent(() => import('./routes/AddClient'))}/>
      <Route component={asyncComponent(() => import('app/routes/extraPages/routes/404'))}/>
    </Switch>
  </div>
);

export default ClientPage;