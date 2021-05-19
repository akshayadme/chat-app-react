import React from 'react';
import { Alert, Button, Divider, Drawer, Icon } from 'rsuite';
import { useProfile } from '../../context/Profile.context';
import { database } from '../../misc/firebase';
import EditableInput from '../EditableInput';
import AvtarUploadBtn from './AvtarUploadBtn';
import { getUserUpdates } from '../../misc/helper';
import ProviderBlock from './ProviderBlock';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();

  const onSave = async newData => {
    try {
      const updates = await getUserUpdates(
        profile.uid,
        'name',
        newData,
        database
      );

      await database.ref().update(updates);
      Alert.success('NickName has been updated', 4000);
    } catch (error) {
      // console.log(error);
      Alert.error(error.message, 4000);
    }
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <h3>Hey, {profile.name}</h3>
        <ProviderBlock />
        <Divider />
        <EditableInput
          initialValue={profile.name}
          onSave={onSave}
          label={<h6 className="mb-3">Nickname </h6>}
          name="nickname"
        />
        <AvtarUploadBtn />
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
