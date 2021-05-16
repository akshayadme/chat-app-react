import React, { useCallback } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import Dashboard from '.';
import { auth } from '../../misc/firebase';
import { useMediaQuery, useModelState } from '../custHook/CustomHook';

const DashboardToggle = () => {
  const { isOpen, open, close } = useModelState();
  const isMobile = useMediaQuery('(max-width:992px)');

  const onSignOut = useCallback(() => {
    auth.signOut();

    Alert.info('Signed Out', 4000);
    close();
  }, [close]);
  return (
    <>
      <Button block color="blue" onClick={open}>
        <Icon icon="dashboard"> Dashboard </Icon>
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
        <Dashboard onSignOut={onSignOut} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
