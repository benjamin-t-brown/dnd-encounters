import TabNavigationBar from 'components/TabNavigationBar';
import NewPartyTemplateModal from 'components/NewPartyTemplateModal';
import { PartyStorage, saveEncounterDatabase } from 'data/storage';
import CardTitle from 'elements/CardTitle';
import CardTitleZone from 'elements/CardTitleZone';
import CornerButton from 'elements/CornerButton';
import FlexWrapCard from 'elements/FlexWrapCard';
import FlexWrapCardDateTime from 'elements/FlexWrapCardDateTime';
import StandardLayout from 'elements/StandardLayout';
import TopBar from 'elements/TopBar';
import { useDatabase, useGlobalConfirm, usePageReRender } from 'hooks';
import React from 'react';
import { getColors } from 'style';
import styled from 'styled-components';
import { PageProps, sortByDate } from 'utils';

const InnerRoot = styled.div<Object>(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
});

const PartyItem = (props: { party: PartyStorage }) => {
  const data = useDatabase();
  const render = usePageReRender();

  return (
    <FlexWrapCard
      style={{
        width: '200px',
        height: '144px',
        background: getColors().BACKGROUND3,
      }}
    >
      <FlexWrapCardDateTime
        date={props.party.lastUpdated}
        deleteMsg={
          'Are you sure you wish to delete party with name: ' +
          props.party.name +
          '?'
        }
        handleDelete={() => {
          const ind = data.parties.findIndex(p => p.id === props.party.id);
          if (ind !== -1) {
            const newParties = data.parties.slice();
            newParties.splice(ind, 1);
            data.parties = newParties;
            saveEncounterDatabase(data);
            render();
          }
        }}
      />
      <h3
        style={{
          // textAlign: 'center',
          margin: '4px 0px',
          whiteSpace: 'pre',
          width: '100%',
          overflow: 'hidden',
          padding: '0px 4px',
          textOverflow: 'ellipsis',
        }}
      >
        {props.party.name}
      </h3>
      <div>
        {props.party.partyMembers.map((partyMemberName, i) => {
          return (
            <div
              key={partyMemberName + i}
              style={{
                marginLeft: '4px',
              }}
            >
              - {partyMemberName}
            </div>
          );
        })}
      </div>
    </FlexWrapCard>
  );
};

const PartyListPage = (props: PageProps) => {
  const parties = props.data.parties;

  return (
    <>
      <TopBar>
        <CardTitleZone align="left"></CardTitleZone>
        <CardTitle>DND Encounters</CardTitle>
        <CardTitleZone align="right"></CardTitleZone>
      </TopBar>
      <StandardLayout topBar>
        <TabNavigationBar />
        <InnerRoot>
          <div>
            <NewPartyTemplateModal />
          </div>
          <h1>Parties</h1>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {parties.sort(sortByDate).map(party => {
              return <PartyItem key={party.id} party={party} />;
            })}
          </div>
        </InnerRoot>
      </StandardLayout>
    </>
  );
};

export default PartyListPage;
