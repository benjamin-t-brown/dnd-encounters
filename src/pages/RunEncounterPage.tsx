import MDEditor from '@uiw/react-md-editor';
import AddUnitToEncounterModal from 'components/AddUnitToEncounterModal';
import DiceRoller from 'components/DiceRoller';
import EditEncounterHpModal from 'components/EditEncounterHpModal';
import TabNavigationBar from 'components/TabNavigationBar';
import { getModifier, rollInitiative } from 'data/dice';
import {
  Encounter,
  UnitInEncounter,
  getEncounterById,
  getEncounterTemplateById,
  isEncounterStarted,
  saveEncounterDatabase,
} from 'data/storage';
import Button from 'elements/Button';
import CardTitle from 'elements/CardTitle';
import CardTitleZone from 'elements/CardTitleZone';
import CornerButton from 'elements/CornerButton';
import {
  FormStatNumberInput,
  FormTextInput,
  FormTextInputFullWidth,
} from 'elements/FormInputs';
import HSpace from 'elements/HSpace';
import ImagePortrait from 'elements/ImagePortrait';
import PctBar from 'elements/PctBar';
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

const EncounterUnit = (props: {
  unit: UnitInEncounter;
  encounter: Encounter;
  isActive: boolean;
  onClick: () => void;
}) => {
  const unit = props.unit;
  const render = usePageReRender();
  const showConfirm = useGlobalConfirm();
  const data = useDatabase();

  const change = (name: string, value: number) => {
    unit.current[name] = value;
    render();
  };

  const handleMoveIndex = (offset: -1 | 1) => {
    const currentIndex = props.encounter.units.indexOf(unit);
    const nextIndex = currentIndex + offset;
    if (nextIndex < 0 || nextIndex >= props.encounter.units.length) {
      return;
    }
    const otherUnit = props.encounter.units[nextIndex];
    props.encounter.units[nextIndex] = unit;
    props.encounter.units[currentIndex] = otherUnit;
  };

  const isDowned = props.unit.current.hp <= 0;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          height: '0px',
        }}
      >
        <CornerButton
          style={{
            height: '20px',
            transform: 'translate(-1px, 1px)',
          }}
          onClick={ev => {
            ev.preventDefault();
            showConfirm(
              'Are you sure you wish to remove this unit: ' + unit.name,
              () => {
                props.encounter.units = props.encounter.units.filter(
                  u => u !== unit
                );
                saveEncounterDatabase(data);
                render();
              }
            );
          }}
        >
          X
        </CornerButton>
      </div>
      <div
        onClick={props.onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: isDowned
            ? '#111'
            : props.isActive
            ? getColors().BACKGROUND3
            : getColors().BACKGROUND2,
          border:
            '1px solid ' +
            (props.isActive ? getColors().TEXT_DEFAULT : getColors().SECONDARY),
          borderRadius: '4px',
          padding: '4px',
          // filter: props.unit.current.hp <= 0 ? 'grayscale(100%)' : undefined,
        }}
      >
        <div
          style={{
            width: '30px',
            textAlign: 'center',
            // minHeight: '20px',
            padding: '8px',
            marginRight: '8px',
            fontSize: '18px',
            border: '1px solid white',
            borderRadius: '20px',
          }}
        >
          {unit.isPlayer ? (
            '?'
          ) : (
            <span
              style={
                {
                  // color: getColors().PRIMARY,
                }
              }
            >
              {unit.current.publicId ?? '?'}
            </span>
          )}
        </div>
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              width: '40px',
            }}
          >
            <Button
              color="plain"
              style={{
                fontSize: '12px',
              }}
              onClick={ev => {
                ev.stopPropagation();
                handleMoveIndex(-1);
                render();
              }}
            >
              up
            </Button>
            <Button
              color="plain"
              style={{
                fontSize: '12px',
              }}
              onClick={ev => {
                ev.stopPropagation();
                handleMoveIndex(+1);
                render();
              }}
            >
              dn
            </Button>
          </div>
        </div>
        <HSpace />
        <ImagePortrait
          imgUrl={props.unit.imgUrl}
          hideThreshold={-1}
          style={{
            filter: isDowned ? 'grayscale(100%)' : undefined,
          }}
        />
        <HSpace />
        <div>
          <span>{props.unit.name}</span>
          <div>
            <FormStatNumberInput
              label="Initiative"
              name="initiative"
              formState={{
                initiative: unit.current.initiative ?? '',
              }}
              change={change}
            />
            <span
              style={{
                display: 'inline-block',
              }}
            >
              <div
                style={{
                  color: getColors().TEXT_DESCRIPTION,
                  textAlign: 'center',
                }}
              >
                HP
              </div>
              <EditEncounterHpModal unit={props.unit} />
            </span>
            <div
              style={{
                width: '100%',
                maxWidth: '138px',
              }}
            >
              <PctBar pct={unit.current.hp / unit.hp} height={'8px'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UnitInfo = (props: { unit: UnitInEncounter }) => {
  const change = () => void 0;
  const formState = props.unit.stats;

  return (
    <div
      style={{
        padding: '4px 8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <ImagePortrait imgUrl={props.unit.imgUrl} hideThreshold={-1} />
        <HSpace />
        <h2>{props.unit.name}</h2>
        <HSpace />
        {props.unit.type ? (
          <FormTextInput
            label="Type"
            name="type"
            formState={props.unit}
            change={change}
            width={'100px'}
            disabled
          />
        ) : null}
        <HSpace />
        <FormTextInput
          label="Size"
          name="size"
          formState={props.unit}
          change={change}
          width={'100px'}
          disabled
        />
        <HSpace />
        <FormTextInput
          label="Alignment"
          name="alignment"
          formState={props.unit}
          change={change}
          width={'100px'}
          disabled
        />
      </div>
      <div
        style={{
          margin: '12px 0',
          padding: '12px',
          border: '1px solid ' + getColors().TEXT_DESCRIPTION,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <FormStatNumberInput
          label="Max HP"
          name="hp"
          formState={props.unit}
          change={change}
          disabled
        />
        <FormStatNumberInput
          label="Armor Class"
          name="AC"
          formState={props.unit}
          change={change}
          disabled
        />
        <HSpace />
        <HSpace />
        <HSpace />
        <div>
          <FormStatNumberInput
            label="STR"
            name="STR"
            formState={formState}
            change={change}
            disabled
          />
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {(getModifier(formState.STR) > 0 ? '+' : '') +
              getModifier(formState.STR)}
          </div>
        </div>
        <div>
          <FormStatNumberInput
            label="DEX"
            name="DEX"
            formState={formState}
            change={change}
            disabled
          />
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {(getModifier(formState.DEX) > 0 ? '+' : '') +
              getModifier(formState.DEX)}
          </div>
        </div>
        <div>
          <FormStatNumberInput
            label="CON"
            name="CON"
            formState={formState}
            change={change}
            disabled
          />
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {(getModifier(formState.CON) > 0 ? '+' : '') +
              getModifier(formState.CON)}
          </div>
        </div>
        <div>
          <FormStatNumberInput
            label="INT"
            name="INT"
            formState={formState}
            change={change}
            disabled
          />
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {(getModifier(formState.INT) > 0 ? '+' : '') +
              getModifier(formState.INT)}
          </div>
        </div>
        <div>
          <FormStatNumberInput
            label="WIS"
            name="WIS"
            formState={formState}
            change={change}
            disabled
          />
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {(getModifier(formState.WIS) > 0 ? '+' : '') +
              getModifier(formState.WIS)}
          </div>
        </div>
        <div>
          <FormStatNumberInput
            label="CHA"
            name="CHA"
            formState={formState}
            change={change}
            disabled
          />
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {(getModifier(formState.CHA) > 0 ? '+' : '') +
              getModifier(formState.CHA)}
          </div>
        </div>
      </div>
      <div>
        <FormStatNumberInput
          label="Speed"
          name="speed"
          formState={props.unit}
          change={change}
          disabled
        />
        <HSpace />
        <FormStatNumberInput
          label="Speed Water"
          name="speedSwim"
          formState={props.unit}
          change={change}
          disabled
        />
        <HSpace />
        <FormStatNumberInput
          label="Speed Fly"
          name="speedFly"
          formState={props.unit}
          change={change}
          disabled
        />
      </div>
      <div>
        <FormTextInputFullWidth
          label="Saving Throws"
          name="savingThrows"
          formState={props.unit}
          change={change}
          disabled
        />
        <HSpace />
        <FormTextInputFullWidth
          label="Immunities"
          name="immunities"
          formState={props.unit}
          change={change}
          disabled
        />
        <HSpace />
        <FormTextInputFullWidth
          label="Resistances"
          name="resistances"
          formState={props.unit}
          change={change}
          disabled
        />
        <HSpace />
        <FormTextInputFullWidth
          label="Vulnerabilities"
          name="vulnerabilities"
          formState={props.unit}
          change={change}
          disabled
        />
      </div>
      <div
        style={{
          margin: '16px 0px',
        }}
      >
        <MDEditor.Markdown
          source={props.unit.notes ?? ''}
          style={{ whiteSpace: 'pre-wrap', padding: '8px' }}
          // wrapperElement={{
          //   'data-color-mode': 'light',
          // }}
        />
      </div>
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
  const [selectedUnit, setSelectedUnit] = React.useState<UnitInEncounter>(
    encounter.units[0]
  );

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
    if (!nextUnit.isPlayer) {
      setSelectedUnit(nextUnit);
    }
  };

  if (isError) {
    return <div></div>;
  }

  return (
    <Root>
      <TopBar>
        <CardTitleZone align="left"></CardTitleZone>
        <CardTitle>Run Encounter</CardTitle>
        <CardTitleZone align="right"></CardTitleZone>
      </TopBar>
      <StandardLayout topBar>
        <TabNavigationBar />
        <h3>Encounter: {encounter.name}</h3>
        <InnerRoot>
          <div
            style={{
              display: 'flex',
              marginBottom: window.innerWidth < 600 ? '0px' : '8px',
              flexDirection: window.innerWidth < 600 ? 'column' : 'row',
            }}
          >
            <div
              style={{
                width: '355px',
              }}
            >
              <div>
                <Button
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
                  Roll Initv
                </Button>
                <HSpace />
                <Button
                  color="secondary"
                  onClick={() => {
                    handleOrderByInitiative();
                    render();
                  }}
                >
                  Sort By Initv
                </Button>
                <AddUnitToEncounterModal encounter={encounter} />
              </div>
              {/* <div>

              </div> */}
            </div>
            <div
              style={{
                marginLeft: window.innerWidth < 600 ? '0px' : '8px',
              }}
            >
              <DiceRoller />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: window.innerWidth < 600 ? 'column' : 'row',
              alignItems: window.innerWidth < 600 ? 'center' : 'flex-start',
            }}
          >
            <div
              style={{
                width: '355px',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  color="plain"
                  onClick={() => {
                    handleTurnChange(-1);
                    render();
                  }}
                >
                  - Prev Turn
                </Button>
                {/* <HSpace /> */}
                <Button
                  color="plain"
                  onClick={() => {
                    handleTurnChange(1);
                    render();
                  }}
                >
                  + Next Turn
                </Button>
              </div>
              {encounter.units.map((unit, i) => {
                return (
                  <EncounterUnit
                    key={i + '-' + unit.current.publicId}
                    unit={unit}
                    encounter={encounter}
                    isActive={encounter.turnIndex === i}
                    onClick={() => {
                      if (!unit.isPlayer) {
                        setSelectedUnit(unit);
                      }
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
              <UnitInfo unit={selectedUnit} />
            </div>
          </div>
        </InnerRoot>
      </StandardLayout>
    </Root>
  );
};

export default RunEncounterPage;
