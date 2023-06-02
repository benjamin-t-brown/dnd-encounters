import { useDatabase, useLSRoute } from 'hooks';
import EditEncounterTemplatePage from 'pages/EditEncounterTemplatePage';
import EditPartyTemplatePage from 'pages/EditPartyTemplatePage';
import EditUnitTemplatePage from 'pages/EditUnitTemplatePage';
import EncounterListPage from 'pages/EncounterListPage';
import ErrorPage from 'pages/ErrorPage';
import PartyListPage from 'pages/PartyListPage';
import RunEncounterPage from 'pages/RunEncounterPage';
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
  if (route?.includes('encounter-template:')) {
    return <EditEncounterTemplatePage />;
  }
  if (route?.includes('party-template:')) {
    return <EditPartyTemplatePage />;
  }
  if (route?.includes('run-encounter:')) {
    return <RunEncounterPage />;
  }
  return <ErrorPage data={data} />;
};

export default Router;
