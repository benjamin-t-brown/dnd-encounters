import TabNavigationBar from 'components/TabNavigationBar';
import {
  ItemTemplate,
  getItemTemplateById,
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
import MDEditor from '@uiw/react-md-editor';

const InnerRoot = styled.div<Object>(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
});

const ItemTemplateDisplay = (props: { itemTemplate: ItemTemplate }) => {
  const itemTemplate = props.itemTemplate;

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ImagePortrait imgUrl={itemTemplate.imgUrl} hideThreshold={-1} large />
      </div>
      <br />
      <h2>{itemTemplate.name}</h2>
      <br />
      <FormTextInput
        label="Rarity"
        name="rarity"
        formState={itemTemplate}
        change={() => void 0}
        width={'100px'}
        disabled
      />
      <HSpace />
      <div
        style={{
          margin: '16px 0px',
          display: 'block',
        }}
      >
        <MDEditor.Markdown
          source={itemTemplate.notes ?? ''}
          style={{ whiteSpace: 'pre-wrap', padding: '8px' }}
        />
      </div>
    </>
  );
};

const ItemTemplateExternalPage = (
  props: PageProps & { itemTemplateId: string }
) => {
  const itemTemplate = getItemTemplateById(props.itemTemplateId, props.data);
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
        <InnerRoot>
          {itemTemplate ? (
            <ItemTemplateDisplay itemTemplate={itemTemplate} />
          ) : (
            <div>Item not found.</div>
          )}
        </InnerRoot>
      </StandardLayout>
    </>
  );
};

export default ItemTemplateExternalPage;
