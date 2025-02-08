import { getColors } from 'style';
import { createRoot } from 'react-dom/client';
import App from 'App';
import React from 'react';
import {
  loadEncounterDatabase,
  mergeEncounterDatabase,
  saveEncounterDatabase,
} from 'data/storage';
import { createDataContext } from 'db';

async function main() {
  console.log('app starting...');

  const div = document.createElement('div');
  div.id = 'app';
  document.body.innerHTML = '';
  document.body.appendChild(div);
  document.body.style.background = getColors().BACKGROUND;

  const params = new URLSearchParams(window.location.search);
  const databaseUrl = params.get('databaseUrl');
  let db = loadEncounterDatabase();

  if (databaseUrl) {
    const fixedUrl = decodeURIComponent(databaseUrl);
    try {
      const parsedData = await fetch(fixedUrl).then(res => res.json());

      const newDb = mergeEncounterDatabase(db, parsedData);
      saveEncounterDatabase(newDb);
      db = newDb;
      console.log('Loaded database from URL: ', fixedUrl);
    } catch (e) {
      console.error('Failed to load database from URL', fixedUrl, e);
      const div = document.createElement('div');
      div.innerHTML = 'Failed to load db: ' + String(e.stack);
      document.body.appendChild(div);
      return;
    }
  }

  createDataContext(db);
  console.log('Data context created.');

  const root = createRoot(div);
  root.render(React.createElement(App));
}

window.addEventListener('load', () => {
  main();
});
