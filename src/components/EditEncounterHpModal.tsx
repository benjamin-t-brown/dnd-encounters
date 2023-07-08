import { UnitInEncounter } from 'data/storage';
import Button from 'elements/Button';
import HSpace from 'elements/HSpace';
import ImagePortrait from 'elements/ImagePortrait';
import InputLabel from 'elements/InputLabel';
import VSpace from 'elements/VSpace';
import { useModal, usePageReRender } from 'hooks';
import React, { useEffect } from 'react';
import { MAX_WIDTH, getColors } from 'style';

const getNextHpColor = (nextHp: number, currentHp: number) => {
  if (nextHp > currentHp) {
    return getColors().SUCCESS_TEXT;
  } else if (nextHp < currentHp) {
    return getColors().ERROR_TEXT;
  } else {
    return getColors().TEXT_DEFAULT;
  }
};

const EditEncounterHpModal = (props: { unit: UnitInEncounter }) => {
  const [modifyBy, setModifyBy] = React.useState(0);
  const [overrideHp, setOverrideHp] = React.useState(props.unit.current.hp);
  const [nextHp, _setNextHp] = React.useState(props.unit.current.hp);
  const render = usePageReRender();
  const setNextHp = (nextHp: number) => {
    if (nextHp < 0) {
      nextHp = 0;
    }
    _setNextHp(nextHp);
  };

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      props.unit.current.hp = nextHp;
      setModifyBy(0);
      setOverrideHp(nextHp);
      setNextHp(nextHp);
      render();
    },
    onCancel: () => {},
    title: 'Edit HP',
    body: (
      <div>
        <div
          style={{
            margin: '16px 0px',
          }}
        >
          Now Editing HP for{' '}
          <span
            style={{
              color: getColors().SUCCESS_TEXT,
            }}
          >
            {props.unit.name}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: getColors().BACKGROUND,
            padding: '16px',
            border: '1px solid ' + getColors().TEXT_DESCRIPTION,
          }}
        >
          <div>
            <ImagePortrait imgUrl={props.unit.imgUrl} hideThreshold={-1} />
            {nextHp > 0 ? (
              <Button
                color="primary"
                onClick={() => {
                  setModifyBy(0);
                  setOverrideHp(0);
                  setNextHp(0);
                }}
                style={{
                  width: '66px',
                }}
              >
                Down!
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={() => {
                  setModifyBy(0);
                  setOverrideHp(1);
                  setNextHp(1);
                }}
                style={{
                  width: '66px',
                }}
              >
                Up!
              </Button>
            )}
          </div>
          <HSpace />
          <HSpace />
          <div>
            <div>Cur HP: {props.unit.current.hp}</div>
            <div>Max HP: {props.unit.hp}</div>
          </div>
          <HSpace />
          <HSpace />
          <div>
            <Button
              color="secondary"
              onClick={() => {
                if (modifyBy === 0) {
                  setModifyBy(-1);
                } else {
                  setModifyBy(modifyBy * -1);
                }
              }}
              style={{
                fontSize: '12px',
              }}
            >
              {modifyBy < 0 ? '+' : '-'}
            </Button>
          </div>
          <HSpace />
          <HSpace />
          <div>
            <div>
              <InputLabel>Modify By</InputLabel>
              <input
                type="text"
                value={modifyBy}
                id="edit-hp-modal-input"
                onChange={ev => {
                  const nextModifyBy = ev.target.value;
                  const nextModifyByInt = parseInt(nextModifyBy);
                  setModifyBy(nextModifyBy as any);
                  setOverrideHp(props.unit.current.hp);
                  if (!isNaN(nextModifyByInt)) {
                    setNextHp(props.unit.current.hp + nextModifyByInt);
                  }
                }}
                autoFocus={true}
                style={{
                  marginTop: '4px',
                  width: '75px',
                  fontSize: '24px',
                }}
              />
            </div>
            <VSpace />
            <div
              style={{
                color: getColors().TEXT_DESCRIPTION,
              }}
            >
              OR
            </div>
            <VSpace />
            <div>
              <InputLabel>Set HP</InputLabel>
              <input
                type="text"
                value={overrideHp}
                onChange={ev => {
                  const nextOverrideHp = ev.target.value;
                  const nextOverrideHpInt = parseInt(nextOverrideHp);
                  setModifyBy(0);
                  setOverrideHp(nextOverrideHp as any);
                  if (!isNaN(nextOverrideHpInt)) {
                    setNextHp(nextOverrideHpInt);
                  }
                }}
                style={{
                  marginTop: '4px',
                  width: '75px',
                  fontSize: '24px',
                }}
                // autoFocus={true}
              />
            </div>
          </div>
          <HSpace />
          <HSpace />
          <div
            style={{
              color: getNextHpColor(nextHp, props.unit.current.hp),
            }}
          >
            Next HP: {nextHp}
          </div>
        </div>
      </div>
    ),
    maxWidth: MAX_WIDTH / 2 + 'px',
  });

  // useEffect(() => {
  //   if (modal) {
  //     const elem = document.getElementById('edit-hp-modal-input');
  //     if (elem && nextValue === props.value) {
  //       (elem as any).select();
  //     }
  //   }
  // }, [modal, nextValue, props.value]);

  return (
    <>
      <Button
        color="primary"
        onClick={ev => {
          ev.stopPropagation();
          setOpen(true);
        }}
        style={{
          width: '65px',
          padding: '7px',
          fontSize: '14px',
          background:
            props.unit.current.hp === props.unit.hp
              ? getColors().SUCCESS_BACKGROUND
              : undefined,
        }}
      >
        {props.unit.isPlayer
          ? props.unit.current.hp > 0
            ? 'OK'
            : 'Down'
          : props.unit.current.hp ?? ''}
      </Button>
      {modal}
    </>
  );
};

export default EditEncounterHpModal;
