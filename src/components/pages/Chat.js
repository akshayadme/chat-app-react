import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import { CurrentRoomProvider } from '../../context/CurrentRoomContext';
import { useRooms } from '../../context/RoomsContext';
import { auth } from '../../misc/firebase';
import { transformToArray } from '../../misc/helper';
import Bottom from '../chat-window/bottom/Bottom';
import Messages from '../chat-window/messages/Messages';
import Top from '../chat-window/top/Top';

const Chat = () => {
  const { chatId } = useParams();
  const rooms = useRooms();

  if (!rooms) {
    return <Loader center vertical size="md" content="Loading" speed="slow" />;
  }

  const currentRoom = rooms.find(room => room.id === chatId);

  if (!currentRoom) {
    return <h6 className="text-center mt-page">Chat {chatId} not found</h6>;
  }

  const { name, desc } = currentRoom;

  const admins = transformToArray(currentRoom.admins);
  const isAdmin = admins.includes(auth.currentUser.uid);

  const currentRoomData = {
    name,
    desc,
    admins,
    isAdmin,
  };

  return (
    <CurrentRoomProvider data={currentRoomData}>
      <div className="chat-top">
        <Top />
      </div>
      <div className="chat-middle">
        <Messages />
      </div>
      <div className="chat-bottom">
        <Bottom />
      </div>
    </CurrentRoomProvider>
  );
};

export default Chat;
