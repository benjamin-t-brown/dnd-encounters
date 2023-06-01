import React, { useContext } from 'react';
import StandardLayout from 'elements/StandardLayout';
import TopBar from 'elements/TopBar';
import styled from 'styled-components';
import CardTitle from 'elements/CardTitle';
import CardTitleZone from 'elements/CardTitleZone';
import {
  PageProps,
  createAggStringList,
  downloadObjectAsJson,
  sortByDate,
} from 'utils';
import Button from 'elements/Button';
import {
  getFormValues,
  useDatabase,
  useModal,
  usePageReRender,
  useReRender,
} from 'hooks';
import UnitTemplateForm from 'components/UnitTemplateForm';
import {
  EncounterDatabase,
  EncounterTemplate,
  createEncounterTemplate,
  createUnitTemplate,
  getUnitTemplateById,
  getUnitTemplateByName,
  saveEncounterDatabase,
} from 'data/storage';
import { UnitTemplateFormState, formStateToUnitTemplate } from 'data/form';
import EncounterTemplateForm from 'components/EncounterTemplateForm';
import { getColors } from 'style';
import { DataContext } from 'App';
import NewEncounterTemplateModal from 'components/NewEncounterTemplateModal';
import HSpace from 'elements/HSpace';
import ImportDatabaseModal from 'components/ImportDatabaseModal';
import NewUnitTemplateModal from 'components/NewUnitTemplateModal';
import NewPartyTemplateModal from 'components/NewPartyTemplateModal';
import TabNavigationBar from 'components/TabNavigationBar';
import FlexWrapCard from 'elements/FlexWrapCard';
import FlexWrapCardDateTime from 'elements/FlexWrapCardDateTime';
import DefaultDatabase from 'data/defaultDatabase';

const InnerRoot = styled.div<Object>(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
});

const EncounterItem = (props: { encounterTemplate: EncounterTemplate }) => {
  const data = useDatabase();
  const render = usePageReRender();

  const aggUnits = createAggStringList(props.encounterTemplate.units).map(
    ({ id, count }) => {
      const unitTemplate = getUnitTemplateById(id, data);
      return {
        unitTemplate,
        count,
      };
    }
  );

  if (aggUnits.length > 4) {
    for (let i = 3; i < aggUnits.length; i++) {
      aggUnits[i].unitTemplate = undefined;
    }
  }

  return (
    <FlexWrapCard
      style={{
        width: '300px',
        height: '144px',
        background: getColors().BACKGROUND2,
      }}
    >
      <FlexWrapCardDateTime
        date={props.encounterTemplate.lastUpdated}
        deleteMsg={
          'Are you sure you wish to delete encounter template with name: "' +
          props.encounterTemplate.name +
          '"?'
        }
        handleDelete={() => {
          const ind = data.encounterTemplates.findIndex(
            t => t.id === props.encounterTemplate.id
          );
          console.log('HANDLE DELETE!', ind);
          if (ind !== -1) {
            const newTemplates = data.encounterTemplates.slice();
            newTemplates.splice(ind, 1);
            data.encounterTemplates = newTemplates;
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
        {props.encounterTemplate.name}
      </h3>
      <div>
        {aggUnits.map(({ unitTemplate, count }, i) => {
          if (unitTemplate) {
            return (
              <div
                key={unitTemplate.id}
                style={{
                  marginLeft: '4px',
                }}
              >
                - {count} {unitTemplate?.name}
              </div>
            );
          } else {
            return (
              <div
                key={i}
                style={{
                  marginLeft: '4px',
                }}
              >
                ...
              </div>
            );
          }
        })}
      </div>
    </FlexWrapCard>
  );
};

const EncounterListPage = (props: PageProps) => {
  const encounterTemplates = props.data.encounterTemplates;
  const render = usePageReRender();

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
            <NewEncounterTemplateModal />
            <HSpace />
            <NewUnitTemplateModal />
            <HSpace />
            <ImportDatabaseModal />
            <HSpace />
            <NewPartyTemplateModal />
            <HSpace />
            <Button
              color="secondary"
              onClick={() => {
                saveEncounterDatabase(DefaultDatabase as any);
                render();
              }}
            >
              Reset Database
            </Button>
            <HSpace />
            <Button
              color="secondary"
              onClick={() => {
                downloadObjectAsJson(
                  props.data,
                  'dnd-encounters-database.json'
                );
                render();
              }}
            >
              Export Database
            </Button>
            <HSpace />
          </div>
          <h1>Encounter Templates</h1>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {encounterTemplates.sort(sortByDate).map(encounterTemplate => {
              return (
                <EncounterItem
                  key={encounterTemplate.id}
                  encounterTemplate={encounterTemplate}
                />
              );
            })}
          </div>
        </InnerRoot>
      </StandardLayout>
    </>
  );
};

export default EncounterListPage;
