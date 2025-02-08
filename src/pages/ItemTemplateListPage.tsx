import TabNavigationBar from 'components/TabNavigationBar';
import {
  ItemTemplate,
  getLSItemTemplateFilter,
  saveEncounterDatabase,
  setLSItemTemplateFilter,
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
import NewItemTemplateModal from 'components/NewItemTemplateModal';
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

const ItemTemplateBox = (props: {
  itemTemplate: ItemTemplate;
  setCloneTemplateId: (id: string) => void;
}) => {
  const data = useDatabase();
  const render = usePageReRender();
  const itemTemplates = data.itemTemplates ?? [];

  return (
    <FlexWrapCard
      style={{
        width: '245px',
        height: '124px',
        background: getColors().BACKGROUND3,
      }}
      onClick={() => {
        setLSRoute('item-template:' + props.itemTemplate.id);
      }}
    >
      <FlexWrapCardDateTime
        date={props.itemTemplate.lastUpdated ?? 0}
        deleteMsg={
          'Are you sure you wish to delete item with name: ' +
          props.itemTemplate.name +
          '?'
        }
        handleDelete={() => {
          const ind = itemTemplates.findIndex(
            p => p.id === props.itemTemplate.id
          );
          if (ind !== -1) {
            const newItemTemplates = itemTemplates.slice();
            newItemTemplates.splice(ind, 1);
            data.itemTemplates = newItemTemplates;
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
                props.setCloneTemplateId(props.itemTemplate.id);
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
          margin: '4px 0px',
          whiteSpace: 'pre',
          width: '100%',
          overflow: 'hidden',
          padding: '0px 4px',
          textOverflow: 'ellipsis',
        }}
      >
        {props.itemTemplate.name}
      </h3>
      <div
        style={{
          display: 'flex',
        }}
      >
        <ImagePortrait imgUrl={props.itemTemplate.imgUrl} hideThreshold={0} />
        <HSpace />
        <div>{props.itemTemplate.rarity?.toUpperCase()}</div>
      </div>
    </FlexWrapCard>
  );
};

const ItemTemplateListPage = (props: PageProps) => {
  const templates = props.data.itemTemplates ?? [];
  const [filter, _setFilter] = useState(getLSItemTemplateFilter());
  const setFilter = (value: string) => {
    _setFilter(value);
    setLSItemTemplateFilter(value);
  };
  const [cloneTemplateId, setCloneTemplateId] = useState<string | undefined>();

  const filteredItems = templates.filter(item => {
    if (filter) {
      return item.name.toLowerCase().includes(filter.toLowerCase());
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
          <h1>Item Templates</h1>
          <div
            style={{
              marginBottom: '16px',
            }}
          >
            <NewItemTemplateModal itemTemplateId={cloneTemplateId} />
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
            items={filteredItems.sort(sortByName)}
            maxItemsPerPage={20}
            renderItem={itemTemplate => {
              return (
                <ItemTemplateBox
                  key={itemTemplate.id}
                  itemTemplate={itemTemplate}
                  setCloneTemplateId={id => {
                    setCloneTemplateId(id);
                    setTimeout(() => {
                      document.getElementById('new-item-template')?.click();
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

export default ItemTemplateListPage;
