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

const UnitInfoModal = (
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
    confirmText: 'OK',
    title: 'Unit Info: ' + props.unitInEncounter?.name,
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
          {props.unitInEncounter ? (
            <EncounterUnitInfo unit={props.unitInEncounter} />
          ) : null}
        </div>
      </div>
    ),
    maxWidth: MAX_WIDTH / 2 + 'px',
  });

  return (
    <>
      <div
        style={props.style}
        onClick={ev => {
          ev.stopPropagation();
          setOpen(true);
        }}
      >
        {props.children}
      </div>
      {modal}
    </>
  );
};

export default UnitInfoModal;
