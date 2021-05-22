import React from 'react';
import { Button, Modal } from 'rsuite';
import { useModelState } from '../../custHook/CustomHook';
import ProfileAvatar from '../../dashboard/ProfileAvatar';

const ProfileInfoBtnModal = ({ profile, children, ...btnProps }) => {
  const { isOpen, close, open } = useModelState();
  const { name, avatar, createdAt } = profile;
  const shortname = profile.name.split(' ')[0];
  const memberSince = new Date(createdAt).toLocaleDateString();

  return (
    <>
      <Button onClick={open} {...btnProps}>
        {shortname}
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>{shortname} Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar
            src={avatar}
            name={name}
            className="width-200 height-200 img-fullsize font-huge"
          />

          <h4 className="mt-2">{name}</h4>
          <p>Member Since {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfoBtnModal;
