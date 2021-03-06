import React, { memo } from 'react';
import { Button, Modal } from 'rsuite';
import { useCurrentRoom } from '../../../context/CurrentRoomContext';
import { useModelState } from '../../custHook/CustomHook';

const RoomInfoBtnModal = () => {
  const { isOpen, open, close } = useModelState();
  const description = useCurrentRoom(v => v.desc);

  const name = useCurrentRoom(v => v.name);

  return (
    <>
      <Button appearance="link" className="px-0" onClick={open}>
        More Information
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title> About {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="mb-1"> Description</h6>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close} block>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(RoomInfoBtnModal);
