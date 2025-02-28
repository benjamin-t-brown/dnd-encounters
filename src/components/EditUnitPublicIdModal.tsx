import { UnitInEncounter } from 'data/storage';
import HSpace from 'elements/HSpace';
import ImagePortrait from 'elements/ImagePortrait';
import InputLabel from 'elements/InputLabel';
import { useModal, usePageReRender } from 'hooks';
import React from 'react';
import { MAX_WIDTH, getColors } from 'style';

const EditUnitPublicIdModal = (props: { unit: UnitInEncounter }) => {
  const [id, setId] = React.useState(String(props.unit.current.publicId));
  const render = usePageReRender();

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      props.unit.current.publicId = id as any;
      render();
    },
    onCancel: () => {},
    title: 'Edit Id',
    isInputModal: true,
    body: (
      <div>
        <div
          style={{
            margin: '16px 0px',
          }}
        >
          Now Editing Id for{' '}
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
            alignItems: 'center',
            justifyContent: 'center',
            background: getColors().BACKGROUND,
            padding: '16px',
            border: '1px solid ' + getColors().TEXT_DESCRIPTION,
          }}
        >
          <ImagePortrait
            imgUrl={props.unit.imgUrl}
            hideThreshold={-1}
            style={{
              width: '96px',
              height: '96px',
            }}
          />
          <HSpace />
          <div>
            <InputLabel>Id</InputLabel>
            <input
              type="text"
              value={id}
              onChange={ev => {
                setId(ev.target.value);
              }}
              autoFocus={true}
              style={{
                marginTop: '4px',
                width: '75px',
                fontSize: '24px',
              }}
            />
          </div>
        </div>
      </div>
    ),
    maxWidth: MAX_WIDTH / 2 + 'px',
  });

  return (
    <>
      <button
        onClick={ev => {
          ev.stopPropagation();
          setOpen(true);
        }}
      >
        {props.unit.current.publicId}
      </button>
      {modal}
    </>
  );
};

export default EditUnitPublicIdModal;
