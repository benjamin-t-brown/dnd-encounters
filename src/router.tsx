import { useDatabase, useLSRoute } from 'hooks';
import EditEncounterTemplatePage from 'pages/EditEncounterTemplatePage';
import EditPartyTemplatePage from 'pages/EditPartyTemplatePage';
import EditUnitTemplatePage from 'pages/EditUnitTemplatePage';
import EncounterListPage from 'pages/EncounterListPage';
import ErrorPage from 'pages/ErrorPage';
import PartyListPage from 'pages/PartyListPage';
import DicePage from 'pages/DicePage';
import RunEncounterPage from 'pages/RunEncounterPage';
import UnitTemplateListPage from 'pages/UnitTemplateListPage';
import React from 'react';
import ItemTemplateListPage from 'pages/ItemTemplateListPage';
import EditItemTemplatePage from 'pages/EditItemTemplatePage';
import ItemTemplateExternalPage from 'pages/ItemTemplateExternalPage';

const Router = () => {
  const route = useLSRoute();
  const data = useDatabase();

  const params = new URLSearchParams(window.location.search);
  const itemTemplateId = params.get('itemTemplateId');

  if (itemTemplateId) {
    return (
      <ItemTemplateExternalPage data={data} itemTemplateId={itemTemplateId} />
    );
  }

  if (!route || route === 'encounter-list') {
    return <EncounterListPage data={data} />;
  }
  if (route === 'party-list') {
    return <PartyListPage data={data} />;
  }
  if (route === 'unit-list') {
    return <UnitTemplateListPage data={data} />;
  }
  if (route === 'item-list') {
    return <ItemTemplateListPage data={data} />;
  }
  if (route?.includes('unit-template:')) {
    return <EditUnitTemplatePage />;
  }
  if (route?.includes('encounter-template:')) {
    return <EditEncounterTemplatePage />;
  }
  if (route?.includes('item-template:')) {
    return <EditItemTemplatePage />;
  }
  if (route?.includes('party-template:')) {
    return <EditPartyTemplatePage />;
  }
  if (route?.includes('run-encounter:')) {
    return <RunEncounterPage />;
  }
  if (route?.includes('dice')) {
    return <DicePage data={data} />;
  }
  return <ErrorPage data={data} />;
};

export default Router;
