import React, { useState } from 'react';
import StandardLayout from 'elements/StandardLayout';
import TopBar from 'elements/TopBar';
import styled from 'styled-components';
import CardTitle from 'elements/CardTitle';
import CardTitleZone from 'elements/CardTitleZone';
import { PageProps, createAggStringList, sortByDate } from 'utils';
import Button from 'elements/Button';
import { setLSRoute, useDatabase, usePageReRender } from 'hooks';
import {
  Encounter,
  EncounterTemplate,
  getEncounterTemplateById,
  getPartyStorageById,
  getUnitTemplateById,
  saveEncounterDatabase,
} from 'data/storage';
import { getColors } from 'style';
import NewEncounterTemplateModal from 'components/NewEncounterTemplateModal';
import HSpace from 'elements/HSpace';
import TabNavigationBar from 'components/TabNavigationBar';
import FlexWrapCard from 'elements/FlexWrapCard';
import FlexWrapCardDateTime from 'elements/FlexWrapCardDateTime';
import DatabaseManagementBar from 'components/DatabaseManagementBar';
import VSpace from 'elements/VSpace';
import NewEncounterModal from 'components/NewEncounterModal';
import PaginatedFlexWrapList from 'elements/PaginatedFlexWrapList';
import { FormTextInput } from 'elements/FormInputs';
import Pill from 'elements/Pill';

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
  key?: string;
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
        transform:
          window.innerWidth < 400
            ? 'scale(0.8)'
            : window.innerWidth < 500
            ? 'scale(0.9)'
            : '',
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
          color: getColors().ERROR_TEXT,
          marginBottom: '4px',
        }}
      >
        {props.encounterTemplate.campaign ? (
          <Pill>{props.encounterTemplate.campaign}</Pill>
        ) : (
          '(no campaign)'
        )}
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

const EncounterItem = (props: { encounter: Encounter; key?: string }) => {
  const data = useDatabase();
  const render = usePageReRender();

  return (
    <FlexWrapCard
      style={{
        width: '300px',
        height: '132px',
        background: getColors().BACKGROUND3,
        transform:
          window.innerWidth < 400
            ? 'scale(0.8)'
            : window.innerWidth < 500
            ? 'scale(0.9)'
            : '',
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
          marginLeft: '4px',
        }}
      >
        {props.encounter.campaign ? (
          <Pill>{props.encounter.campaign}</Pill>
        ) : (
          '(no campaign)'
        )}
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
            marginTop: '4px',
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
          <h2>Run Encounters</h2>
          <div
            style={{
              marginBottom: '16px',
            }}
          >
            <NewEncounterModal templateId={defaultTemplateId} />
          </div>
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
          <h2>Encounter Templates</h2>
          <div
            style={{
              marginBottom: '16px',
            }}
          >
            <NewEncounterTemplateModal />
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
