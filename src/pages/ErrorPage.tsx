import React from 'react';
import StandardLayout from 'elements/StandardLayout';
import TopBar from 'elements/TopBar';
import styled from 'styled-components';
import CardTitle from 'elements/CardTitle';
import CardTitleZone from 'elements/CardTitleZone';
import { PageProps } from 'utils';
import TabNavigationBar from 'components/TabNavigationBar';
import BackButton from 'elements/BackButton';

const InnerRoot = styled.div<Object>(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
});

const ErrorPage = (props: PageProps) => {
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
          <p>
            There is nothing to see here.
            <br />
            <br />
            You have reached the error page.
          </p>
        </InnerRoot>
      </StandardLayout>
    </>
  );
};

export default ErrorPage;
