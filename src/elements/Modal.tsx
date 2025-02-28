import React from 'react';
import { MAX_WIDTH, getColors } from 'style';
import styled from 'styled-components';
import Button from './Button';

const Root = styled.div<Object>(() => {
  return {
    position: 'fixed',
    background: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  };
});

const InnerRoot = styled.div<{ maxWidth?: string }>(props => {
  return {
    width: props.maxWidth ? props.maxWidth : MAX_WIDTH - 200 + 'px',
    padding: '16px',
    border: '1px solid ' + getColors().SECONDARY,
    background: getColors().BACKGROUND2,
    borderRadius: '8px',
  };
});

const ButtonsContainer = styled.div<Object>(() => {
  return {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '16px',
  };
});

export interface ModalProps extends React.PropsWithChildren {
  title?: string;
  onConfirm?: () => boolean | void;
  confirmText?: string;
  onCancel?: () => boolean | void;
  cancelText?: string;
  open: boolean;
  maxWidth?: string;
  body?: React.ReactNode;
  disableEnterConfirm?: boolean;
  isInputModal?: boolean;
}

const Modal = (props: ModalProps) => {
  return (
    <Root
      style={{
        display: props.open ? 'flex' : 'none',
      }}
      onClick={ev => {
        ev.stopPropagation();
      }}
    >
      <InnerRoot
        maxWidth={props.maxWidth}
        style={{
          transform: props.isInputModal
            ? window.innerWidth < 800
              ? 'translateY(-75px)'
              : ''
            : '',
        }}
      >
        <h2>{props.title ?? 'Modal'}</h2>
        <div
          style={{
            maxHeight: window.innerHeight - 200 + 'px',
            overflow: 'auto',
          }}
        >
          {props.children}
          {props.body}
        </div>
        <ButtonsContainer>
          {/* {props.onConfirm && props.onCancel && (
            <Button color="primary" onClick={props.onConfirm}>
              {props.confirmText ?? 'Confirm'}
            </Button>
          )} */}
          {props.onConfirm && (
            <Button color="primary" onClick={props.onConfirm}>
              {props.confirmText ?? 'Confirm'}
            </Button>
          )}
          {props.onCancel && (
            <Button
              color="secondary"
              onClick={props.onCancel}
              style={{
                marginLeft: '8px',
              }}
            >
              {props.cancelText ?? 'Cancel'}
            </Button>
          )}
        </ButtonsContainer>
      </InnerRoot>
    </Root>
  );
};

export default Modal;
