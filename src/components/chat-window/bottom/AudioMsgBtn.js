import React, { useCallback, useState } from 'react';
import { ReactMic } from 'react-mic';
import { useParams } from 'react-router';
import { Alert, Icon, InputGroup } from 'rsuite';
import { storage } from '../../../misc/firebase';

const AudioMsgBtn = ({ afterUpload }) => {
  const { chatId } = useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const onClick = useCallback(() => {
    setIsRecording(p => !p);
  }, []);
  const onUpload = useCallback(
    async data => {
      setLoading(true);
      try {
        const snap = await storage
          .ref(`/chat/${chatId}`)
          .child(`audio_${Date.now()}.mp3`)
          .put(data.blob, {
            cacheControl: `public,max-age= ${2600 * 24 * 3}`,
          });

        const file = {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };

        setLoading(false);
        afterUpload([file]);
      } catch (error) {
        setLoading(false);
        Alert.error(error.message, 4000);
      }
    },
    [afterUpload, chatId]
  );

  return (
    <div>
      <InputGroup.Button
        onClick={onClick}
        disabled={loading}
        className={isRecording ? 'animate-blink' : ''}
      >
        <Icon icon="microphone" />
        <ReactMic
          record={isRecording}
          className="d-none"
          onStop={onUpload}
          mimeType="audio/mp3"
        />
      </InputGroup.Button>
    </div>
  );
};

export default AudioMsgBtn;
