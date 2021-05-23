import React, { useState } from 'react';
import { useParams } from 'react-router';
import { InputGroup, Icon, Modal, Button, Uploader, Alert } from 'rsuite';
import { storage } from '../../../misc/firebase';
import { useModelState } from '../../custHook/CustomHook';

const MAX_SIZE = 1000 * 1024 * 5;

const AttachmentBtnModal = ({ afterUpload }) => {
  const { chatId } = useParams();
  const { isOpen, open, close } = useModelState();

  const [fileList, setFileList] = useState();
  const [loading, setLoading] = useState(false);
  const onChange = fileArr => {
    const filtered = fileArr
      .filter(el => el.blobFile.size <= MAX_SIZE)
      .slice(0, 5);

    setFileList(filtered);
  };

  const onUpload = async () => {
    try {
      const uploadPromises = fileList.map(f => {
        return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + f.name)
          .put(f.blobFile, {
            cacheControl: `public,max-age= ${2600 * 24 * 3}`,
          });
      });
      const uploadSnap = await Promise.all(uploadPromises);

      const shapePromise = uploadSnap.map(async snap => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
      });

      const files = await Promise.all(shapePromise);
      await afterUpload(files);

      setLoading(false);
      close();
    } catch (error) {
      setLoading(false);
      Alert.error(error.message, 4000);
    }
  };
  return (
    <>
      <InputGroup.Button onClick={open}>
        <Icon icon="attachment" />
      </InputGroup.Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            onChange={onChange}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={loading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={onUpload} disabled={loading}>
            {' '}
            Send to chat{' '}
          </Button>
          <div className="text-right mt-3">
            <small>* Only files less then 5MB are allowed</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttachmentBtnModal;
