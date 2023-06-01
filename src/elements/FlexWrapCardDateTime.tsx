import { useGlobalConfirm } from 'hooks';
import React from 'react';
import { getColors } from 'style';
import CornerButton from './CornerButton';

const FlexWrapCardDateTime = (props: {
  date: number;
  deleteMsg: string;
  handleDelete: () => void;
}) => {
  const showConfirm = useGlobalConfirm();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          textAlign: 'center',
          color: getColors().TEXT_DESCRIPTION,
          marginLeft: '4px',
        }}
      >
        {new Date(props.date).toISOString()}
      </div>
      <CornerButton
        onClick={ev => {
          ev.stopPropagation();
          showConfirm(props.deleteMsg, () => {
            props.handleDelete();
          });
        }}
      >
        X
      </CornerButton>
    </div>
  );
};

export default FlexWrapCardDateTime;
