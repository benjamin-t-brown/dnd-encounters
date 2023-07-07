import React, { useContext, useState } from 'react';
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
  setLSRoute,
  useDatabase,
  useModal,
  usePageReRender,
  useReRender,
} from 'hooks';
import UnitTemplateForm from 'components/UnitTemplateForm';
import {
  Encounter,
  EncounterDatabase,
  EncounterTemplate,
  createEncounterTemplate,
  createUnitTemplate,
  getEncounterById,
  getEncounterTemplateById,
  getLSUnitTemplateFilter,
  getPartyStorageById,
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
import DatabaseManagementBar from 'components/DatabaseManagementBar';
import VSpace from 'elements/VSpace';
import NewEncounterModal from 'components/NewEncounterModal';
import PaginatedFlexWrapList from 'elements/PaginatedFlexWrapList';
import { FormTextInput } from 'elements/FormInputs';

const InnerRoot = styled.div<Object>(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
});

const EncounterTemplateItem = (props: {
  encounterTemplate: EncounterTemplate;
  setDefaultTemplateId: (str: string) => void;
}) => {
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
        height: '160px',
        background: getColors().BACKGROUND2,
      }}
      onClick={() => {
        setLSRoute('encounter-template:' + props.encounterTemplate.id);
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
          if (ind !== -1) {
            const newTemplates = data.encounterTemplates.slice();
            newTemplates.splice(ind, 1);
            data.encounterTemplates = newTemplates;
            saveEncounterDatabase(data);
            render();
          }
        }}
        auxButton={
          <>
            <Button
              color="primary"
              style={{
                fontSize: '12px',
                padding: '2px 8px',
              }}
              onClick={ev => {
                ev.stopPropagation();
                props.setDefaultTemplateId(props.encounterTemplate.id);
                setTimeout(() => {
                  const elem = document.getElementById('new-encounter-modal');
                  elem?.click();
                }, 1);
              }}
            >
              Start
            </Button>
            <HSpace />
          </>
        }
      />
      <div
        style={{
          marginLeft: '14px',
          color: getColors().ERROR_TEXT,
          marginBottom: '4px',
        }}
      >
        {props.encounterTemplate.campaign || '(no campaign)'}
      </div>
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

const EncounterItem = (props: { encounter: Encounter }) => {
  const data = useDatabase();
  const render = usePageReRender();

  return (
    <FlexWrapCard
      style={{
        width: '300px',
        height: '132px',
        background: getColors().BACKGROUND3,
      }}
      onClick={() => {
        setLSRoute('run-encounter:' + props.encounter.id);
      }}
    >
      <FlexWrapCardDateTime
        date={props.encounter.lastUpdated}
        deleteMsg={
          'Are you sure you wish to delete encounter with name: "' +
          props.encounter.name +
          '"?'
        }
        handleDelete={() => {
          const ind = data.encounters.findIndex(
            t => t.id === props.encounter.id
          );
          if (ind !== -1) {
            const newEncounters = data.encounters.slice();
            newEncounters.splice(ind, 1);
            data.encounters = newEncounters;
            saveEncounterDatabase(data);
            render();
          }
        }}
      />
      <div
        style={{
          color: getColors().ERROR_TEXT,
          marginBottom: '4px',
        }}
      >
        {props.encounter.campaign || '(no campaign)'}
      </div>
      <h3
        style={{
          margin: '4px 0px',
          whiteSpace: 'pre',
          width: '100%',
          overflow: 'hidden',
          padding: '0px 4px',
          textOverflow: 'ellipsis',
        }}
      >
        {props.encounter.name}
      </h3>
      <div>
        <p
          style={{
            marginLeft: '8px',
          }}
        >
          Encounter:{' '}
          <i>
            {getEncounterTemplateById(props.encounter.templateId, data)?.name}
          </i>
          <br />
          Party:{' '}
          <i>{getPartyStorageById(props.encounter.partyId, data)?.name}</i>
        </p>

        {/* {props.encounter.units.map((unit, i) => {
          if (unit) {
            return (
              <div
                key={unit.id + i}
                style={{
                  marginLeft: '4px',
                }}
              >
                - {unit?.name}
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
        })} */}
      </div>
    </FlexWrapCard>
  );
};

const EncounterListPage = (props: PageProps) => {
  const encounterTemplates = props.data.encounterTemplates;
  const [defaultTemplateId, setDefaultTemplateId] = useState('');

  const [encounterTemplatesFilter, setEncounterTemplatesFilter] = useState('');
  const [encountersFilter, setEncountersFilter] = useState('');

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
          <h1>Encounter Templates</h1>
          <div
            style={{
              marginBottom: '16px',
            }}
          >
            <NewEncounterTemplateModal />
            <HSpace />
            <NewEncounterModal templateId={defaultTemplateId} />
            <HSpace />
          </div>
          <div style={{}}>
            <div>
              <FormTextInput
                label="Filter"
                name="filter"
                formState={{
                  filter: encounterTemplatesFilter,
                }}
                change={(_, value) => {
                  setEncounterTemplatesFilter(value);
                }}
              />
              <HSpace />
              <Button
                color={'plain'}
                onClick={() => {
                  setEncounterTemplatesFilter('');
                }}
              >
                Clear
              </Button>
            </div>
            <PaginatedFlexWrapList
              items={encounterTemplates
                .filter(encounterTemplate => {
                  if (encounterTemplatesFilter) {
                    return (
                      (encounterTemplate.campaign ?? '')
                        .toLowerCase()
                        .includes(encounterTemplatesFilter.toLowerCase()) ||
                      encounterTemplate.name
                        .toLowerCase()
                        .includes(encounterTemplatesFilter.toLowerCase()) ||
                      encounterTemplate.units.some(unitId => {
                        return getUnitTemplateById(unitId, props.data)
                          ?.name.toLowerCase()
                          .includes(encounterTemplatesFilter.toLowerCase());
                      })
                    );
                  }
                  return true;
                })
                .sort(sortByDate)}
              maxItemsPerPage={20}
              renderItem={encounterTemplate => {
                return (
                  <EncounterTemplateItem
                    key={encounterTemplate.id}
                    encounterTemplate={encounterTemplate}
                    setDefaultTemplateId={setDefaultTemplateId}
                  />
                );
              }}
            />
          </div>
          <h1>Run Encounters</h1>
          <div style={{}}>
            <div>
              <FormTextInput
                label="Filter"
                name="filter"
                formState={{
                  filter: encountersFilter,
                }}
                change={(_, value) => {
                  setEncountersFilter(value);
                }}
              />
              <HSpace />
              <Button
                color={'plain'}
                onClick={() => {
                  setEncountersFilter('');
                }}
              >
                Clear
              </Button>
            </div>
            <PaginatedFlexWrapList
              items={props.data.encounters
                .filter(encounter => {
                  if (encountersFilter) {
                    return (
                      encounter.name
                        .toLowerCase()
                        .includes(encountersFilter.toLowerCase()) ||
                      encounter.campaign
                        ?.toLowerCase()
                        .includes(encountersFilter.toLowerCase()) ||
                      encounter.units.some(unit =>
                        unit?.name
                          .toLowerCase()
                          .includes(encountersFilter.toLowerCase())
                      )
                    );
                  }
                  return true;
                })
                .sort(sortByDate)}
              maxItemsPerPage={20}
              renderItem={encounter => {
                return (
                  <EncounterItem key={encounter.id} encounter={encounter} />
                );
              }}
            />
          </div>
          <VSpace />
          <VSpace />
          <VSpace />
          <VSpace />
          <VSpace />
          <VSpace />
          <DatabaseManagementBar />
        </InnerRoot>
      </StandardLayout>
    </>
  );
};

export default EncounterListPage;
