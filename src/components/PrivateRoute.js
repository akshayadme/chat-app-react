import React from 'react';
import { Redirect, Route } from 'react-router';
import { Container, Loader } from 'rsuite';
import { useProfile } from '../context/Profile.context';

const PrivateRoute = ({ children, ...routeProps }) => {
  const { profile, loading } = useProfile();
  if (loading && !profile) {
    return (
      <Container>
        <Loader center vertical size="md" content="loading" speed="slow" />
      </Container>
    );
  }
  if (!profile && !loading) {
    return <Redirect to="/signin" />;
  }

  return <Route {...routeProps}>{children}</Route>;
};

export default PrivateRoute;
