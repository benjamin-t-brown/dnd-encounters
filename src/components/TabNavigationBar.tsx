import {
  EncounterDatabase,
  getEncounterById,
  getEncounterTemplateById,
  getPartyStorageById,
  getUnitTemplateById,
} from 'data/storage';
import Button from 'elements/Button';
import { Dropdown, DropdownSection } from 'elements/Dropdown';
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
    top: '55px',
    width: 'calc(100% - 50px)',
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
      setSavedTab(route);
    }
  }, [route, savedTab]);

  const isRunningEncounter =
    route?.includes('run-encounter') || route?.includes('dice');

  const buttons: JSX.Element[] = [];

  // if (isRunningEncounter) {
  //   buttons.push(
  //     <React.Fragment key="enc-tabs">
  //       <TabButton
  //         active={route?.includes('encounter-list') || !route}
  //         onClick={() => {
  //           setLSRoute('encounter-list');
  //         }}
  //       >
  //         Encounters
  //       </TabButton>
  //       <HSpace />
  //     </React.Fragment>
  //   );
  // } else {
  buttons.push(
    <React.Fragment key="normal-tabs">
      <TabButton
        active={route?.includes('encounter-list') || !route}
        onClick={() => {
          setLSRoute('encounter-list');
        }}
      >
        Home
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
        active={route?.includes('item-list')}
        onClick={() => {
          setLSRoute('item-list');
        }}
      >
        Items
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
    </React.Fragment>
  );

  const getButtonLabel = () => {
    switch (true) {
      case route?.includes('unit-list'):
        return 'Units';
      case route?.includes('item-list'):
        return 'Items';
      case route?.includes('party-list'):
        return 'Parties';
      case route?.includes('dice'):
        return 'Dice';
      case savedTab && savedTab === route:
        getTemplateName(savedTab, data);
      case route?.includes('encounter-list') || !route:
      default:
        return 'Home';
    }
  };

  const buttonLabel = getButtonLabel();
  // }

  // if (isRunningEncounter) {
  buttons.push(
    <React.Fragment key="enc-plus-tabs">
      <TabButton
        active={route?.includes('dice')}
        onClick={() => {
          setLSRoute('dice');
        }}
      >
        Dice
      </TabButton>
      <HSpace />
    </React.Fragment>
  );
  // }

  if (savedTab) {
    buttons.push(
      <React.Fragment key="saved-tabs">
        <TabButton
          key="saved-tab"
          active={false}
          onClick={() => {
            if (savedTab && savedTab !== route) {
              setLSRoute(savedTab);
            }
          }}
        >
          {getTemplateName(savedTab, data)}
        </TabButton>
        <HSpace />
      </React.Fragment>
    );
  }

  return (
    <Root>
      <Dropdown buttonText={buttonLabel + ' ≡'} placement="right-start">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <DropdownSection>
            <TabButton
              active={false}
              onClick={() => {
                setLSRoute('encounter-list');
              }}
            >
              Home
            </TabButton>
          </DropdownSection>
          <DropdownSection>
            <TabButton
              active={false}
              onClick={() => {
                setLSRoute('unit-list');
              }}
            >
              Units
            </TabButton>
          </DropdownSection>
          <DropdownSection>
            <TabButton
              active={false}
              onClick={() => {
                setLSRoute('item-list');
              }}
            >
              Items
            </TabButton>
          </DropdownSection>
          <DropdownSection>
            <TabButton
              active={false}
              onClick={() => {
                setLSRoute('party-list');
              }}
            >
              Parties
            </TabButton>
          </DropdownSection>
          <DropdownSection>
            <TabButton
              active={false}
              onClick={() => {
                setLSRoute('dice');
              }}
            >
              Dice
            </TabButton>
          </DropdownSection>
          {savedTab ? (
            <DropdownSection>
              <TabButton
                key="saved-tab"
                active={false}
                onClick={() => {
                  if (savedTab && savedTab !== route) {
                    setLSRoute(savedTab);
                  }
                }}
              >
                {getTemplateName(savedTab, data)}
              </TabButton>
            </DropdownSection>
          ) : null}
        </div>
      </Dropdown>
    </Root>
  );

  // return (
  //   <Root>
  //     <div style={{ overflow: 'hidden' }}>{...buttons}</div>
  //   </Root>
  // );
};

export default TabNavigationBar;
