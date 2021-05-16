import React, { useState, useRef } from 'react';
import { Alert, Button, Icon, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useModelState } from '../custHook/CustomHook';
import { useProfile } from '../../context/Profile.context';
import { storage, database } from '../../misc/firebase';

const fileInputType = '.png, .jpeg, .jpg';

const acceptedfiletype = ['image/png', 'image/jpeg', 'image/pjepg'];

const isValidFile = file => {
  return acceptedfiletype.includes(file.type);
};

const getBlob = canvas => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('File process error'));
      }
    });
  });
};

const AvtarUploadBtn = () => {
  const { profile } = useProfile();
  const { isOpen, open, close } = useModelState();

  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const avatarEditorRef = useRef();

  const onFileInputChange = e => {
    const currFile = e.target.files;
    if (currFile.length === 1) {
      const file = currFile[0];
      if (isValidFile(file)) {
        setImg(file);
        open();
      } else {
        Alert.warning(`Wrong file type ${file.type}`, 4000);
      }
    }
  };

  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();

    setIsLoading(true);
    try {
      const blob = await getBlob(canvas);

      const avatarFileRef = storage
        .ref(`/profiles/${profile.uid}`)
        .child('avatar');

      const uploadAvatarResult = await avatarFileRef.put(blob, {
        cacheControl: `public,max-age=${3600 * 24 * 3}`,
      });

      const downloadURL = await uploadAvatarResult.ref.getDownloadURL();

      const userAvatarRef = database
        .ref(`/profiles/${profile.uid}`)
        .child('avatar');

      userAvatarRef.set(downloadURL);
      setIsLoading(false);
      Alert.info('Avatar uploaded', 4000);
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 4000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <div>
        <label htmlFor="avatar" className="d-block cursor-pointer padded">
          Select New Avatar
          <input
            type="file"
            className="d-none"
            id="avatar"
            onChange={onFileInputChange}
            accept={fileInputType}
          />
        </label>

        <Modal show={isOpen} onHide={close}>
          <Modal.Header>
            <Modal.Title>Adjust and upload new avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center h-100 align-items-center">
              {img && (
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={img}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              appearance="ghost"
              onClick={onUploadClick}
              disabled={isLoading}
            >
              <Icon icon="upload2" /> Upload
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvtarUploadBtn;
