import { useDatabase, useLSRoute } from 'hooks';
import EditUnitTemplatePage from 'pages/EditUnitTemplatePage';
import EncounterListPage from 'pages/EncounterListPage';
import ErrorPage from 'pages/ErrorPage';
import PartyListPage from 'pages/PartyListPage';
import UnitTemplateListPage from 'pages/UnitTemplateListPage';
import React from 'react';

const Router = () => {
  const route = useLSRoute();
  const data = useDatabase();
  if (!route || route === 'encounter-list') {
    return <EncounterListPage data={data} />;
  }
  if (route === 'party-list') {
    return <PartyListPage data={data} />;
  }
  if (route === 'unit-list') {
    return <UnitTemplateListPage data={data} />;
  }
  if (route?.includes('unit-template:')) {
    return <EditUnitTemplatePage />;
  }
  return <ErrorPage data={data} />;
};

export default Router;
