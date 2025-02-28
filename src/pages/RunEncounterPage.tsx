import AddUnitToEncounterModal from 'components/AddUnitToEncounterModal';
import DiceModal from 'components/DiceModal';
import EncounterUnit from 'components/EncounterUnit';
import EncounterUnitInfo from 'components/EncounterUnitInfo';
import TabNavigationBar from 'components/TabNavigationBar';
import UnitInfoModal from 'components/UnitInfoModal';
import { rollInitiative } from 'data/dice';
import {
  Encounter,
  UnitInEncounter,
  getEncounterById,
  isEncounterStarted,
  saveEncounterDatabase,
} from 'data/storage';
import BackButton from 'elements/BackButton';
import Button from 'elements/Button';
import CardTitle from 'elements/CardTitle';
import CardTitleZone from 'elements/CardTitleZone';
import { Dropdown, DropdownSection } from 'elements/Dropdown';
import HSpace from 'elements/HSpace';

import StandardLayout from 'elements/StandardLayout';
import TopBar from 'elements/TopBar';
import {
  setLSRoute,
  useDatabase,
  useGlobalAlert,
  useGlobalConfirm,
  useLSRoute,
  usePageReRender,
} from 'hooks';
import React, { useEffect } from 'react';
import { MAX_WIDTH, getColors } from 'style';
import styled from 'styled-components';

const Root = styled.div<Object>(() => {
  return {};
});

const InnerRoot = styled.div<Object>(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
});

const CardSubHeader = (props: {
  selectedUnit: UnitInEncounter | undefined;
  encounter: Encounter;
  showConfirm: (msg: string, onConfirm: () => void) => void;
  showAll: boolean;
  render: () => void;
  handleOrderByInitiative: () => void;
  setShowAll: (showAll: boolean) => void;
  handleTurnChange: (inc: number) => void;
}) => {
  const {
    selectedUnit,
    encounter,
    showConfirm,
    render,
    handleOrderByInitiative,
    handleTurnChange,
    setShowAll,
    showAll,
  } = props;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Dropdown
        buttonText="..."
        style={{
          marginLeft: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <DropdownSection>
            <Button
              fullWidth
              color="secondary"
              onClick={() => {
                if (isEncounterStarted(encounter)) {
                  showConfirm(
                    'Are you sure you wish to re-roll initiative?',
                    () => {
                      rollInitiative(encounter);
                      render();
                    }
                  );
                } else {
                  rollInitiative(encounter);
                  render();
                }
              }}
            >
              Roll Initiative
            </Button>
          </DropdownSection>
          <DropdownSection>
            <Button
              fullWidth
              color="secondary"
              onClick={() => {
                handleOrderByInitiative();
                render();
              }}
            >
              Sort By Initiative
            </Button>
          </DropdownSection>
          <DropdownSection>
            <AddUnitToEncounterModal encounter={encounter} />
          </DropdownSection>
        </div>
      </Dropdown>
      {/* <div
        style={{
          marginLeft: '8px',
        }}
      >
        <div>{selectedUnit?.name}</div>
      </div> */}
    </div>
  );
};

const RunEncounterPage = () => {
  const route = useLSRoute();
  const showAlert = useGlobalAlert();
  const showConfirm = useGlobalConfirm();
  const data = useDatabase();
  const render = usePageReRender();
  const [, encounterId] = route?.split(':') ?? [];

  useEffect(() => {
    saveEncounterDatabase(data);
  });

  let isError = false;
  if (!encounterId) {
    console.error('Invalid encounter id');
    setLSRoute('error');
    isError = true;
    // return <div></div>;
  }
  const encounter: Encounter = getEncounterById(encounterId, data) as Encounter;
  if (!encounter) {
    console.error('Encounter not found ' + encounterId);
    setLSRoute('error');
    isError = true;
    // return <div></div>;
  }
  const [showAll, _setShowAll] = React.useState(!encounter.shrinkUnitUi);
  const [selectedUnit, setSelectedUnit] = React.useState<UnitInEncounter>(
    encounter.units[encounter.turnIndex]
  );

  const setShowAll = (v: boolean) => {
    _setShowAll(v);
    encounter.shrinkUnitUi = !v;
  };

  const handleOrderByInitiative = () => {
    encounter.units.sort((a, b) => {
      if (a.current.initiative > b.current.initiative) {
        return -1;
      }
      if (a.current.initiative < b.current.initiative) {
        return 1;
      }
      if (b.current.stats.DEX === b.current.stats.DEX) {
        return a.current.publicId - b.current.publicId;
      }
      return b.current.stats.DEX - a.current.stats.DEX;
    });
  };

  const handleTurnChange = (offset: -1 | 1) => {
    let nextIndex = encounter.turnIndex;
    let nextUnit: UnitInEncounter | undefined = undefined;

    let ctr = 0;
    do {
      nextIndex += offset;
      if (nextIndex < 0) {
        nextIndex = encounter.units.length - 1;
      }
      if (nextIndex >= encounter.units.length) {
        nextIndex = 0;
        ctr++;
      }
      nextUnit = encounter.units[nextIndex];
    } while (nextUnit.current.hp <= 0 && ctr < 2);

    encounter.turnIndex = nextIndex;
    // if (!nextUnit.isPlayer) {
    setSelectedUnit(nextUnit);
    // }
  };

  if (isError) {
    return <div></div>;
  }

  return (
    <Root>
      <TopBar>
        <CardTitleZone
          align="left"
          style={{
            width: 'unset',
          }}
        >
          <BackButton />
        </CardTitleZone>
        <CardTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              // minWidth: '200px',
            }}
          >
            <Button
              color="plain"
              onClick={() => {
                handleTurnChange(-1);
                render();
              }}
              style={{
                fontSize: '12px',
              }}
            >
              - Prev
            </Button>
            <HSpace />
            <Button color={'secondary'} onClick={() => setShowAll(!showAll)}>
              {showAll ? '-' : '+'}
            </Button>
            <HSpace />
            <Button
              color="plain"
              onClick={() => {
                handleTurnChange(1);
                render();
              }}
              style={{
                fontSize: '12px',
              }}
            >
              + Next
            </Button>
          </div>
        </CardTitle>
        <CardTitleZone
          align="right"
          style={{
            width: 'unset',
          }}
        >
          <CardSubHeader
            selectedUnit={selectedUnit}
            encounter={encounter}
            showConfirm={showConfirm}
            render={render}
            handleOrderByInitiative={handleOrderByInitiative}
            handleTurnChange={handleTurnChange}
            setShowAll={setShowAll}
            showAll={showAll}
          />
        </CardTitleZone>
      </TopBar>
      <StandardLayout topBar>
        <TabNavigationBar />
        <DiceModal />
        <InnerRoot>
          {/* <div
            style={{
              display: 'flex',
              marginBottom: window.innerWidth < 600 ? '0px' : '8px',
              flexDirection: window.innerWidth < 600 ? 'column' : 'row',
            }}
          >
            <div>
              <DiceRoller />
            </div>
          </div> */}
          <div
            style={{
              display: 'flex',
              flexDirection: window.innerWidth < 600 ? 'column' : 'row',
              alignItems: window.innerWidth < 600 ? 'center' : 'flex-start',
            }}
          >
            <div
              style={{
                // width: '355px',
                flexShrink: 0,
              }}
            >
              {encounter.units.map((unit, i) => {
                const isActive = encounter.turnIndex === i;
                return (
                  <EncounterUnit
                    key={i + '-' + unit.current.publicId}
                    unit={unit}
                    encounter={encounter}
                    isActive={isActive}
                    isSmall={showAll ? false : !isActive}
                    onClick={() => {
                      // if (!unit.isPlayer) {
                      setSelectedUnit(unit);
                      // }
                    }}
                  />
                );
              })}
            </div>
            <div
              style={{
                width:
                  window.innerWidth < 600
                    ? 'unset'
                    : MAX_WIDTH - 355 - 32 + 'px',
                marginTop: window.innerWidth < 600 ? '8px' : '0px',
              }}
            >
              <EncounterUnitInfo unit={selectedUnit} />
            </div>
          </div>
        </InnerRoot>
      </StandardLayout>
    </Root>
  );
};

export default RunEncounterPage;
