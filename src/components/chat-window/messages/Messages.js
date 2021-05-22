import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { database } from '../../../misc/firebase';
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
              />
            );
          })}
      </ul>
    </>
  );
};

export default Messages;
