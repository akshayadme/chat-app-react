import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/CurrentRoomContext';
import { useMediaQuery } from '../../custHook/CustomHook';
import RoomInfoBtnModal from './RoomInfoBtnModal';

const Top = () => {
  const name = useCurrentRoom(v => v.name);
  const isMobile = useMediaQuery('(max-width:992px)');

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h4>
          <Icon
            componentClass={Link}
            icon="arrow-circle-left"
            size="2x"
            to="/"
            className={
              isMobile
                ? 'd-inline-block p-0 mr-2 text-blue link-unstyled'
                : 'd-none'
            }
          />
          <span className="text-disapear">{name} </span>
        </h4>

        <ButtonToolbar className="ws-nowrap">todo</ButtonToolbar>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span>todo</span>
        <RoomInfoBtnModal />
      </div>
    </>
  );
};

export default Top;
