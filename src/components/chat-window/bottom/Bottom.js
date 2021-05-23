import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase';
import { useProfile } from '../../../context/Profile.context';
import { database } from '../../../misc/firebase';
import AttachmentBtnModal from './AttachmentBtnModal';
import AudioMsgBtn from './AudioMsgBtn';

function assembleMessage(profile, chatId) {
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0,
  };
}

const Bottom = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { profile } = useProfile();
  const { chatId } = useParams();

  const onChangeHandler = useCallback(value => {
    setInput(value);
  }, []);

  const onSendClick = async () => {
    if (input.trim() === '') {
      return;
    }
    const msgData = assembleMessage(profile, chatId);
    msgData.text = input;

    const updates = {};

    const messageId = database.ref('messages').push().key;

    updates[`/messages/${messageId}`] = msgData;

    updates[`/rooms/${chatId}/lastMessage`] = {
      ...msgData,
      msgId: messageId,
    };

    setLoading(true);
    try {
      await database.ref().update(updates);

      setInput('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.error(error.message, 4000);
    }
  };

  const onKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onSendClick();
    }
  };

  const afterUpload = useCallback(
    async files => {
      setLoading(true);

      const updates = {};

      files.forEach(file => {
        const msgData = assembleMessage(profile, chatId);
        msgData.file = file;

        const messageId = database.ref('messages').push().key;

        updates[`/messages/${messageId}`] = msgData;
      });
      const lastMsgId = Object.keys(updates).pop();

      updates[`/rooms/${chatId}/lastMessage`] = {
        ...updates[lastMsgId],
        msgId: lastMsgId,
      };

      try {
        await database.ref().update(updates);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.error(error.message, 4000);
      }
    },
    [chatId, profile]
  );

  return (
    <div>
      <InputGroup>
        <AttachmentBtnModal afterUpload={afterUpload} />
        <AudioMsgBtn afterUpload={afterUpload} />
        <Input
          placeholder="Write a message here..."
          value={input}
          onChange={onChangeHandler}
          onKeyDown={onKeyDown}
        />
        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClick}
          disabled={loading}
        >
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default Bottom;
