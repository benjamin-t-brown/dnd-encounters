import Button from 'elements/Button';
import InputLabel from 'elements/InputLabel';
import { useModal, usePageReRender } from 'hooks';
import React, { useEffect } from 'react';
import { MAX_WIDTH, getColors } from 'style';

const EditInputModal = (props: {
  label: string;
  value: string;
  buttonLabel: string;
  onConfirm: (v: string) => void;
  inputType?: 'text' | 'number';
  disableReset?: boolean;
  style: React.CSSProperties;
}) => {
  const [nextValue, setNextValue] = React.useState(String(props.value));
  const render = usePageReRender();

  const { modal, setOpen } = useModal({
    onConfirm: () => {
      props.onConfirm(nextValue);
      render();
    },
    isInputModal: true,
    onCancel: () => {},
    title: 'Edit ' + props.label,
    body: (
      <div>
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {!props.disableReset ? (
              <Button
                color="primary"
                onClick={() => {
                  setNextValue(String(0));
                }}
                style={{
                  fontSize: '12px',
                }}
              >
                Reset
              </Button>
            ) : null}
            <InputLabel>{props.label}</InputLabel>
            <input
              id="edit-input-modal-input"
              type={props.inputType || 'text'}
              value={nextValue}
              onChange={ev => {
                setNextValue(ev.target.value);
              }}
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

  useEffect(() => {
    if (modal) {
      const elem = document.getElementById('edit-input-modal-input');
      if (elem && nextValue === props.value) {
        (elem as any).select();
      }
    }
  }, [modal, nextValue, props.value]);

  return (
    <>
      <button
        style={props.style}
        onClick={ev => {
          ev.stopPropagation();
          setOpen(true);
        }}
      >
        {props.buttonLabel}
      </button>
      {modal}
    </>
  );
};

export default EditInputModal;
