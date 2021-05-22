import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/CurrentRoomContext';
import { auth } from '../../../misc/firebase';
import { useHover, useMediaQuery } from '../../custHook/CustomHook';
import ProfileAvatar from '../../dashboard/ProfileAvatar';
import PresenceDot from '../../PresenceDot';
import IconBtnControl from './IconBtnControl';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {
  const { author, createdAt, text, likes, likeCount } = message;
  const [selfRef, isHover] = useHover();
  const isMobile = useMediaQuery('max-width:992px');

  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  const canShowIcons = isMobile || isHover;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

  return (
    <>
      <li
        className={`padded mb-1 cursor-pointer ${isHover ? 'bg-black-02' : ''}`}
        ref={selfRef}
      >
        <div className="d-flex align-items-center font-bolder mb-1">
          <PresenceDot uid={author.uid} />
          <ProfileAvatar
            src={author.avatar}
            name={author.name}
            className="ml-1"
            size="xs"
          />
          <ProfileInfoBtnModal
            profile={author}
            appearances="link"
            className="p-0 ml-1 text-black"
          >
            {canGrantAdmin && (
              <Button
                block
                onClick={() => handleAdmin(author.uid)}
                color="blue"
              >
                {isMsgAuthorAdmin
                  ? 'Remove Admin Permission'
                  : 'Grant as Admin'}
              </Button>
            )}
          </ProfileInfoBtnModal>

          <TimeAgo
            datetime={createdAt}
            className="font-normal text-black-45 ml-2"
          />
          <IconBtnControl
            {...(isLiked ? { color: 'red' } : {})}
            isVisible={canShowIcons}
            iconName="heart"
            tooltip="Like this message"
            onClick={() => handleLike(message.id)}
            badgeContent={likeCount}
          />
          {isAuthor && (
            <IconBtnControl
              isVisible={canShowIcons}
              iconName="trash2"
              tooltip="Delete this message"
              onClick={() => handleDelete(message.id)}
            />
          )}
        </div>
        <div>
          <span className="word-break-all">{text}</span>
        </div>
      </li>
    </>
  );
};

export default memo(MessageItem);
