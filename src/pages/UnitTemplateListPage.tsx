import TabNavigationBar from 'components/TabNavigationBar';
import NewPartyTemplateModal from 'components/NewPartyTemplateModal';
import {
  PartyStorage,
  UnitTemplate,
  getUnitTemplateByName,
  saveEncounterDatabase,
} from 'data/storage';
import CardTitle from 'elements/CardTitle';
import CardTitleZone from 'elements/CardTitleZone';
import CornerButton from 'elements/CornerButton';
import FlexWrapCard from 'elements/FlexWrapCard';
import FlexWrapCardDateTime from 'elements/FlexWrapCardDateTime';
import StandardLayout from 'elements/StandardLayout';
import TopBar from 'elements/TopBar';
import {
  getFormValues,
  useDatabase,
  useGlobalAlert,
  useGlobalConfirm,
  usePageReRender,
} from 'hooks';
import React from 'react';
import { getColors } from 'style';
import styled from 'styled-components';
import { PageProps, sortByDate } from 'utils';
import ImagePortrait from 'elements/ImagePortrait';
import PaginatedFlexWrapList from 'elements/PaginatedFlexWrapList';
import NewUnitTemplateModal from 'components/NewUnitTemplateModal';
import HSpace from 'elements/HSpace';
import { setLSRoute } from 'hooks';
import Button from 'elements/Button';
import { UnitTemplateFormState, formStateToUnitTemplate } from 'data/form';

const InnerRoot = styled.div<Object>(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
});

const UnitItem = (props: { unitTemplate: UnitTemplate }) => {
  const data = useDatabase();
  const render = usePageReRender();

  return (
    <FlexWrapCard
      style={{
        width: '275px',
        height: '124px',
        background: getColors().BACKGROUND3,
      }}
      onClick={() => {
        setLSRoute('unit-template:' + props.unitTemplate.id);
      }}
    >
      <FlexWrapCardDateTime
        date={props.unitTemplate.lastUpdated ?? 0}
        deleteMsg={
          'Are you sure you wish to delete unit with name: ' +
          props.unitTemplate.name +
          '?'
        }
        handleDelete={() => {
          const ind = data.unitTemplates.findIndex(
            p => p.id === props.unitTemplate.id
          );
          if (ind !== -1) {
            const newUnitTemplates = data.unitTemplates.slice();
            newUnitTemplates.splice(ind, 1);
            data.unitTemplates = newUnitTemplates;
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
        {props.unitTemplate.name}
      </h3>
      <div
        style={{
          display: 'flex',
        }}
      >
        <ImagePortrait imgUrl={props.unitTemplate.imgUrl} />
        <HSpace />
        <div
          style={{
            color: getColors().TEXT_DESCRIPTION,
          }}
        >
          AC: {props.unitTemplate.AC} HP: {props.unitTemplate.hp}
        </div>
      </div>
    </FlexWrapCard>
  );
};

const UnitTemplateListPage = (props: PageProps) => {
  const units = props.data.unitTemplates;

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
            <NewUnitTemplateModal />
          </div>
          <h1>Unit Templates</h1>
          <PaginatedFlexWrapList
            items={units.sort(sortByDate)}
            maxItemsPerPage={20}
            renderItem={unitTemplate => {
              return (
                <UnitItem key={unitTemplate.id} unitTemplate={unitTemplate} />
              );
            }}
          />
        </InnerRoot>
      </StandardLayout>
    </>
  );
};

export default UnitTemplateListPage;
