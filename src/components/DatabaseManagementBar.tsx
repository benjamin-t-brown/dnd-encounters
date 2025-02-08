import React from 'react';
import ImportDatabaseModal from './ImportDatabaseModal';
import HSpace from 'elements/HSpace';
import Button from 'elements/Button';
import { saveEncounterDatabase } from 'data/storage';
import DefaultDatabase from 'data/defaultDatabase';
import { useDatabase, useGlobalConfirm, usePageReRender } from 'hooks';
import { downloadObjectAsJson } from 'utils';

const DatabaseManagementBar = () => {
  const render = usePageReRender();
  const data = useDatabase();
  const showConfirm = useGlobalConfirm();

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <ImportDatabaseModal data={data} />
      <HSpace />
      <Button
        color="secondary"
        onClick={() => {
          downloadObjectAsJson(data, 'dnd-encounters-database.json');
          render();
        }}
      >
        Export Database
      </Button>
      <HSpace />
      <Button
        color="plain"
        onClick={() => {
          showConfirm('Are you sure you want to reset the database?', () => {
            saveEncounterDatabase(DefaultDatabase as any);
            window.location.reload();
          });
        }}
      >
        Reset Database
      </Button>
      <HSpace />
    </div>
  );
};

export default DatabaseManagementBar;
