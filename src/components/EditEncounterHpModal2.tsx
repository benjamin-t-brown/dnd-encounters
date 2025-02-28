import React from 'react';
import { useModal, useReRender } from 'hooks';
import { UnitInEncounter } from 'data/storage';
import RangeButtonInput from 'elements/RangeButtonInput';
import Button from 'elements/Button';
import { getColors, MAX_WIDTH } from 'style';
import ImagePortrait from 'elements/ImagePortrait';
import HSpace from 'elements/HSpace';

const EditEncounterHpModal2 = (props: {
  unit: UnitInEncounter;
  onHpChanged: () => void;
}) => {
  // const render = useReRender();

  const [nextHp, _setNextHp] = React.useState(props.unit.current.hp);
  const setNextHp = (nextHp: number) => {
    if (nextHp < 0) {
      nextHp = 0;
    }
    _setNextHp(nextHp);
  };

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      props.unit.current.hp = nextHp;
      // setModifyBy(0);
      // setOverrideHp(nextHp);
      setNextHp(nextHp);
      props.onHpChanged();
      // render();
    },
    onCancel: () => {},
    title: 'Edit HP',
    maxWidth: MAX_WIDTH / 2 + 'px',
    body: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>
          <ImagePortrait
            imgUrl={props.unit.imgUrl}
            hideThreshold={-1}
            style={{
              width: '96px',
              height: '96px',
            }}
          />
        </div>
        <div>{props.unit.name}</div>
        <div>
          {nextHp} / {props.unit.hp}
        </div>
        <RangeButtonInput
          label={`HP (Max=${props.unit.hp})`}
          disableReset={true}
          value={nextHp}
          onChange={v => {
            setNextHp(v);
          }}
          disablePlus={true}
          min={1}
          max={9999}
          step={1}
          style={{ width: '100%' }}
          inputButtonStyle={{
            width: '74px',
          }}
        />
        <div>
          <Button
            color="plain"
            onClick={ev => {
              setNextHp(0);
            }}
            style={{}}
          >
            Down
          </Button>
          <HSpace />
          <Button
            color="plain"
            onClick={ev => {
              setNextHp(props.unit.hp);
            }}
            style={{}}
          >
            Max
          </Button>
        </div>
      </div>
    ),
  });
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

export default EditEncounterHpModal2;
