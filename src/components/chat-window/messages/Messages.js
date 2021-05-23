/* eslint-disable consistent-return */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { transformtoArrWithId } from '../../../misc/helper';
import MessageItem from './MessageItem';

const Messages = () => {
  const [messages, setMessages] = useState(null);
  const { chatId } = useParams();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    const messagesRef = database.ref('/messages');

    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = transformtoArrWithId(snap.val());
        setMessages(data);
      });

    return () => {
      messagesRef.off('value');
    };
  }, [chatId]);

  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);

      let alertMsg;

      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            // eslint-disable-next-line no-param-reassign
            admins[uid] = null;
            alertMsg = 'Admin Permission Removed';
          } else {
            // eslint-disable-next-line no-param-reassign
            admins[uid] = true;
            alertMsg = 'Admin permission Granted';
          }
        }
        return admins;
      });
      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);

    let alertMsg;

    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          // eslint-disable-next-line no-param-reassign
          msg.likeCount -= 1;
          // eslint-disable-next-line no-param-reassign
          msg.likes[uid] = null;
          alertMsg = 'Likes Removed';
        } else {
          // eslint-disable-next-line no-param-reassign
          msg.likeCount += 1;

          if (!msg.likes) {
            // eslint-disable-next-line no-param-reassign
            msg.likes = {};
          }
          // eslint-disable-next-line no-param-reassign
          msg.likes[uid] = true;
          alertMsg = 'Message Liked';
        }
      }
      return msg;
    });
    Alert.info(alertMsg, 4000);
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm('Delete this Message?')) {
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;

      const updates = {};

      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }
      try {
        await database.ref().update(updates);
        Alert.info('Message has been deleted');
      } catch (error) {
        return Alert.error(error.message);
      }

      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (error) {
          Alert.error(error.message);
        }
      }
    },
    [chatId, messages]
  );

  return (
    <>
      <ul className="msg-list custom-scroll">
        {isChatEmpty && <li>No Messages yet</li>}
        {canShowMessages &&
          messages.map(msg => {
            return (
              <MessageItem
                key={msg.id}
                message={msg}
                handleAdmin={handleAdmin}
                handleLike={handleLike}
                handleDelete={handleDelete}
              />
            );
          })}
      </ul>
    </>
  );
};

export default Messages;
