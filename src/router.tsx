import { useDatabase, useLSRoute } from 'hooks';
import EncounterListPage from 'pages/EncounterListPage';
import ErrorPage from 'pages/ErrorPage';
import PartyListPage from 'pages/PartyListPage';
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
  return <ErrorPage data={data} />;
};

export default Router;
