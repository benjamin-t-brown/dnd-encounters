import { UnitInEncounter, UnitTemplate } from 'data/storage';
import Button from 'elements/Button';
import HSpace from 'elements/HSpace';
import ImagePortrait from 'elements/ImagePortrait';
import InputLabel from 'elements/InputLabel';
import VSpace from 'elements/VSpace';
import { useKeyboardEventListener, useModal, usePageReRender } from 'hooks';
import React, { PropsWithChildren, useEffect } from 'react';
import { MAX_WIDTH, getColors } from 'style';
import EncounterUnitInfo from './EncounterUnitInfo';
import DiceRoller from './DiceRoller';

const DiceModal = (
  props: {
    unitInEncounter?: UnitInEncounter;
    style?: React.CSSProperties;
  } & PropsWithChildren
) => {
  const render = usePageReRender();

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      render();
    },
    onCancel: () => {},
    title: 'Roll Dice',
    body: (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: getColors().BACKGROUND,
            // padding: '16px',
            border: '1px solid ' + getColors().TEXT_DESCRIPTION,
          }}
        >
          <DiceRoller />
        </div>
      </div>
    ),
    maxWidth: MAX_WIDTH / 2 + 'px',
  });

  return (
    <>
      <Button
        style={Object.assign(props.style ?? {}, {
          position: 'fixed',
          right: '4px',
          bottom: '4px',
        })}
        onClick={ev => {
          ev.stopPropagation();
          setOpen(true);
        }}
        color="secondary"
      >
        Dice
      </Button>
      {modal}
    </>
  );
};

export default DiceModal;
