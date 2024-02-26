import React from 'react';
import StandardLayout from 'elements/StandardLayout';
import TopBar from 'elements/TopBar';
import styled from 'styled-components';
import CardTitle from 'elements/CardTitle';
import CardTitleZone from 'elements/CardTitleZone';
import { PageProps } from 'utils';
import TabNavigationBar from 'components/TabNavigationBar';
import DiceRoller from 'components/DiceRoller';
import BackButton from 'elements/BackButton';

const InnerRoot = styled.div<Object>(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
});

const DicePage = (props: PageProps) => {
  return (
    <>
      <TopBar>
        <CardTitleZone align="left">
          <BackButton />
        </CardTitleZone>
        <CardTitle>DND Encounters</CardTitle>
        <CardTitleZone align="right"></CardTitleZone>
      </TopBar>
      <StandardLayout topBar>
        <TabNavigationBar />
        <InnerRoot>
          <div
            style={{
              display: 'flex',
              marginBottom: window.innerWidth < 600 ? '0px' : '8px',
              flexDirection: window.innerWidth < 600 ? 'column' : 'row',
            }}
          >
            <div>
              <DiceRoller />
            </div>
          </div>
        </InnerRoot>
      </StandardLayout>
    </>
  );
};

export default DicePage;
