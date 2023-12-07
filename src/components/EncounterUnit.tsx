import {
  Encounter,
  UnitInEncounter,
  saveEncounterDatabase,
} from 'data/storage';
import { useDatabase, useGlobalConfirm, usePageReRender } from 'hooks';
import React, { useEffect, useState } from 'react';
import { getColors } from 'style';
import EditUnitPublicIdModal from './EditUnitPublicIdModal';
import EditEncounterHpModal from './EditEncounterHpModal';
import PctBar from 'elements/PctBar';
import CornerButton from 'elements/CornerButton';
import Button from 'elements/Button';
import HSpace from 'elements/HSpace';
import ImagePortrait from 'elements/ImagePortrait';
import { FormStatNumberInput } from 'elements/FormInputs';

const EncounterUnit = (props: {
  unit: UnitInEncounter;
  encounter: Encounter;
  isActive: boolean;
  isSmall: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
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

  const rootStyle = {
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
  };

  if (props.isSmall) {
    return (
      <div onClick={props.onClick} style={{ ...rootStyle, cursor: 'pointer' }}>
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
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {unit.isPlayer ? '?' : <EditUnitPublicIdModal unit={props.unit} />}
        </div>
        <div
          style={{
            userSelect: 'none',
            width: '60%',
          }}
        >
          {props.unit.name}
        </div>
        <div
          style={{
            width: '25%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <div>
            {/* <div
                  style={{
                    color: getColors().TEXT_DESCRIPTION,
                    textAlign: 'center',
                    marginRight: '8px',
                  }}
                >
                  HP
                </div> */}
            <EditEncounterHpModal unit={props.unit} />
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
    );
  }

  return (
    <div style={props.style}>
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
            transform: props.isActive
              ? 'translate(-0px, 0px)'
              : 'translate(-1px, 1px)',
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
          boxSizing: 'border-box',
          background: isDowned
            ? '#111'
            : props.isActive
            ? getColors().BACKGROUND3
            : getColors().BACKGROUND2,
          border: props.isActive
            ? '4px dashed ' + getColors().ERROR_TEXT
            : '1px solid ' + getColors().SECONDARY,
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
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {unit.isPlayer ? '?' : <EditUnitPublicIdModal unit={props.unit} />}
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
            cursor: 'pointer',
          }}
        />
        <HSpace />
        <div
          style={{
            maxWidth: '142px',
          }}
        >
          <span
            style={{
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {props.unit.name}
          </span>
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
                maxWidth: '142px',
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

export default EncounterUnit;
