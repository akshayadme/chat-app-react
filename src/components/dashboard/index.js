import React from 'react';
import { Button, Drawer, Icon } from 'rsuite';
import { useProfile } from '../../context/Profile.context';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <h3>{profile.name}</h3>
      </Drawer.Body>
      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}>
          <Icon icon="sign-out" /> Logout
        </Button>
      </Drawer.Footer>
    </>
  );
};

export default Dashboard;
