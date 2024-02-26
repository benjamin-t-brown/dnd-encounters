import TabNavigationBar from 'components/TabNavigationBar';
import {
  UnitTemplate,
  getLSUnitTemplateFilter,
  saveEncounterDatabase,
  setLSUnitTemplateFilter,
} from 'data/storage';
import CardTitle from 'elements/CardTitle';
import CardTitleZone from 'elements/CardTitleZone';
import FlexWrapCard from 'elements/FlexWrapCard';
import FlexWrapCardDateTime from 'elements/FlexWrapCardDateTime';
import StandardLayout from 'elements/StandardLayout';
import TopBar from 'elements/TopBar';
import { useDatabase, usePageReRender } from 'hooks';
import React, { useState } from 'react';
import { getColors } from 'style';
import styled from 'styled-components';
import { PageProps, sortByName } from 'utils';
import ImagePortrait from 'elements/ImagePortrait';
import PaginatedFlexWrapList from 'elements/PaginatedFlexWrapList';
import NewUnitTemplateModal from 'components/NewUnitTemplateModal';
import HSpace from 'elements/HSpace';
import { setLSRoute } from 'hooks';
import Button from 'elements/Button';
import VSpace from 'elements/VSpace';
import DatabaseManagementBar from 'components/DatabaseManagementBar';
import { FormTextInput } from 'elements/FormInputs';
import BackButton from 'elements/BackButton';

const InnerRoot = styled.div<Object>(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
});

const UnitItem = (props: {
  unitTemplate: UnitTemplate;
  setCloneTemplateId: (id: string) => void;
}) => {
  const data = useDatabase();
  const render = usePageReRender();

  return (
    <FlexWrapCard
      style={{
        width: '245px',
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
                props.setCloneTemplateId(props.unitTemplate.id);
              }}
            >
              Clone
            </Button>
            <HSpace />
          </>
        }
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
        <ImagePortrait imgUrl={props.unitTemplate.imgUrl} hideThreshold={0} />
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
  const [filter, _setFilter] = useState(getLSUnitTemplateFilter());
  const setFilter = (value: string) => {
    _setFilter(value);
    setLSUnitTemplateFilter(value);
  };
  const [cloneTemplateId, setCloneTemplateId] = useState<string | undefined>();

  const filteredUnits = units.filter(unit => {
    if (filter) {
      return unit.name.toLowerCase().includes(filter.toLowerCase());
    }
    return true;
  });

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
          <h1>Unit Templates</h1>
          <div
            style={{
              marginBottom: '16px',
            }}
          >
            <NewUnitTemplateModal unitTemplateId={cloneTemplateId} />
          </div>
          <div>
            <FormTextInput
              label="Filter"
              name="filter"
              formState={{
                filter,
              }}
              change={(_, value) => {
                setFilter(value);
              }}
            />
            <HSpace />
            <Button
              color={'plain'}
              onClick={() => {
                setFilter('');
              }}
            >
              Clear
            </Button>
          </div>
          <PaginatedFlexWrapList
            items={filteredUnits.sort(sortByName)}
            maxItemsPerPage={20}
            renderItem={unitTemplate => {
              return (
                <UnitItem
                  key={unitTemplate.id}
                  unitTemplate={unitTemplate}
                  setCloneTemplateId={id => {
                    setCloneTemplateId(id);
                    setTimeout(() => {
                      document.getElementById('new-unit-template')?.click();
                    }, 1);
                  }}
                />
              );
            }}
          />
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

export default UnitTemplateListPage;
