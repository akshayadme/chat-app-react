import React from 'react';
import { Switch } from 'react-router';
import 'rsuite/dist/styles/rsuite-default.css';
import Home from './components/pages/Home';
import SignIn from './components/pages/SignIn';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import './styles/main.scss';

function App() {
  return (
    <Switch>
      <PublicRoute exact path="/signin">
        <SignIn />
      </PublicRoute>
      <PrivateRoute exact path="/">
        <Home />
      </PrivateRoute>
    </Switch>
  );
}

export default App;
