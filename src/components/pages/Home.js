import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Col, Grid, Row } from 'rsuite';
import Chat from './Chat';
import { RoomsProvider } from '../../context/RoomsContext';
import { useMediaQuery } from '../custHook/CustomHook';
import SideBar from '../SideBar';

const Home = () => {
  const isdesktop = useMediaQuery('(min-width:992px)');

  const { isExact } = useRouteMatch();

  const canRenderSidebar = isdesktop || isExact;

  return (
    <RoomsProvider>
      <Grid fluid className="h-100">
        <Row className="h-100">
          {canRenderSidebar && (
            <Col xs={24} md={8} className="h-100">
              <SideBar />
            </Col>
          )}

          <Switch>
            <Route exact path="/chat/:chatId">
              <Col xs={24} md={16} className="h-100">
                <Chat />
              </Col>
            </Route>
            <Route>
              {isdesktop && (
                <Col xs={24} md={16} className="h-100">
                  <h6 className="text-center mt-page">please select chat</h6>
                </Col>
              )}
            </Route>
            <Route>
              <p>not found in home</p>
            </Route>
          </Switch>
        </Row>
      </Grid>
    </RoomsProvider>
  );
};

export default Home;
