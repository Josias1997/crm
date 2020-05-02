import React from 'react';
import {ConnectedRouter} from 'connected-react-router'
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router-dom';

import configureStore, {history} from './store';
import './firebase/firebase';
import App from './containers/App';
import ClientProfile from './containers/ClientProfile';
import Login from './components/Client/Login';

export const store = configureStore();

const MainApp = () =>
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/activate-account/:societe/:id/:token" component={() => <Login title="Activate account"/>} />
        <Route path="/account/login" component={() => <Login title="Login"/>} />
        <Route path="/account/profile/:id" component={ClientProfile} />
        <Route path="/" component={App}/>
      </Switch>
    </ConnectedRouter>
  </Provider>;

export default MainApp;