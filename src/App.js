import React from 'react';
import { Switch } from 'react-router';
import 'rsuite/dist/styles/rsuite-default.css';
import Home from './components/pages/Home';
import SignIn from './components/pages/SignIn';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { ProfileProvider } from './context/Profile.context';
import './styles/main.scss';

function App() {
  return (
    <ProfileProvider>
      <Switch>
        <PublicRoute exact path="/signin">
          <SignIn />
        </PublicRoute>
        <PrivateRoute exact path="/">
          <Home />
        </PrivateRoute>
      </Switch>
    </ProfileProvider>
  );
}

export default App;
