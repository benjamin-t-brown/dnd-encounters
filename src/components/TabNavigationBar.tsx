import {
  EncounterDatabase,
  getEncounterById,
  getEncounterTemplateById,
  getPartyStorageById,
  getPartyStorageByName,
  getUnitTemplateById,
} from 'data/storage';
import HSpace from 'elements/HSpace';
import TabButton from 'elements/TabButton';
import {
  RouteString,
  setLSRoute,
  useDatabase,
  useLSRoute,
  usePageReRender,
} from 'hooks';
import React, { useEffect } from 'react';
import { getColors, MAX_WIDTH } from 'style';
import styled from 'styled-components';

const Root = styled.div<Object>(() => {
  return {
    // display: 'flex',
    // justifyContent: 'flex-start',
    whiteSpace: 'pre',
    marginBottom: '8px',
    position: 'fixed',
    top: '52px',
    width: 'calc(100% - 64px)',
    maxWidth: MAX_WIDTH + 'px',
    borderBottom: '1px solid ' + getColors().TEXT_DESCRIPTION,
  };
});

const isEditRoute = (route: RouteString) => {
  return [
    'unit-template',
    'encounter-template',
    'party-template',
    'run-encounter',
  ].some(r => {
    return route?.includes(r);
  });
};

let savedTab: RouteString | undefined = undefined;
const setSavedTab = (t: RouteString) => {
  savedTab = t;
  usePageReRender()();
};

const getTemplateName = (str: string, data: EncounterDatabase) => {
  const [type, id] = str.split(':');
  if (type === 'unit-template') {
    return getUnitTemplateById(id, data)?.name ?? '';
  }
  if (type === 'encounter-template') {
    return getEncounterTemplateById(id, data)?.name ?? '';
  }
  if (type === 'party-template') {
    return getPartyStorageById(id, data)?.name ?? '';
  }
  if (type === 'run-encounter') {
    return getEncounterById(id, data)?.name ?? '';
  }
  return '';
};

const TabNavigationBar = () => {
  const route = useLSRoute();
  const data = useDatabase();

  useEffect(() => {
    if (savedTab !== route && isEditRoute(route)) {
      console.log('Set saved', route);
      setSavedTab(route);
    }
  }, [route, savedTab]);

  console.log('SAVED TAB', savedTab, route);

  return (
    <Root>
      <div>
        <TabButton
          active={route?.includes('encounter-list') || !route}
          onClick={() => {
            setLSRoute('encounter-list');
          }}
        >
          Encounters
        </TabButton>
        <HSpace />
        <TabButton
          active={route?.includes('unit-list')}
          onClick={() => {
            setLSRoute('unit-list');
          }}
        >
          Units
        </TabButton>
        <HSpace />
        <TabButton
          active={route?.includes('party-list')}
          onClick={() => {
            setLSRoute('party-list');
          }}
        >
          Parties
        </TabButton>
        <HSpace />
        {savedTab ? (
          <TabButton
            active={savedTab === route}
            onClick={() => {
              if (savedTab && savedTab !== route) {
                setLSRoute(savedTab);
              }
            }}
          >
            {getTemplateName(savedTab, data)}
          </TabButton>
        ) : null}
        {/* {isEditRoute(route) ? (
          <TabButton active={true}>{route?.split(':')[0]}</TabButton>
        ) : null} */}
      </div>
    </Root>
  );
};

export default TabNavigationBar;
