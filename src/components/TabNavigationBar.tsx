import HSpace from 'elements/HSpace';
import TabButton from 'elements/TabButton';
import { setLSRoute, useLSRoute } from 'hooks';
import React from 'react';
import { getColors, MAX_WIDTH } from 'style';
import styled from 'styled-components';

const Root = styled.div<Object>(() => {
  return {
    // display: 'flex',
    // justifyContent: 'flex-start',
    marginBottom: '8px',
    position: 'fixed',
    top: '52px',
    width: 'calc(100% - 64px)',
    maxWidth: MAX_WIDTH + 'px',
    borderBottom: '1px solid ' + getColors().TEXT_DESCRIPTION,
  };
});

const TabNavigationBar = () => {
  const route = useLSRoute();
  console.log('ROUTE', route);

  return (
    <Root>
      <div>
        <TabButton
          active={route?.includes('encounter-list') || !route}
          onClick={() => {
            setLSRoute('encounter-list');
            // setOpen(true);
          }}
        >
          Encounter Templates
        </TabButton>
        <HSpace />
        <TabButton
          active={route?.includes('unit-list')}
          onClick={() => {
            setLSRoute('unit-list');
            // setOpen(true);
          }}
        >
          Units
        </TabButton>
        <HSpace />
        <TabButton
          active={route?.includes('party-list')}
          onClick={() => {
            setLSRoute('party-list');
            // setOpen(true);
          }}
        >
          Parties
        </TabButton>
      </div>
    </Root>
  );
};

export default TabNavigationBar;
