import React from 'react';
import Button from './Button';
import EditInputModal from 'components/EditInputModal';
import { plusOrMinus } from 'utils';
import HSpace from './HSpace';

interface RangeButtonInputProps {
  value: number;
  min: number;
  max: number;
  step: number;
  label?: string;
  onChange: (v: number) => void;
  disabled?: boolean;
  disablePlus?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const RangeButtonInput = (props: RangeButtonInputProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...(props.style ?? {}),
      }}
    >
      <Button
        color="secondary"
        onClick={() => {
          const nextValue = props.value - props.step;
          if (nextValue >= props.min) {
            props.onChange(nextValue);
          }
        }}
        style={
          {
            // marginLeft: '8px',
          }
        }
      >
        <span style={{ userSelect: 'none' }}>-</span>
      </Button>
      <HSpace />
      <EditInputModal
        label="Bonus"
        value={String(props.value)}
        onConfirm={value => {
          const nextValue = Number(value);
          if (nextValue > props.max) {
            props.onChange(props.max);
          } else if (nextValue < props.min) {
            props.onChange(props.min);
          } else {
            props.onChange(nextValue);
          }
        }}
        inputType="number"
        style={{
          // transform: 'translateY(-2px)',
          color: '#333',
          height: '40px',
        }}
        buttonLabel={
          (props.disablePlus ? '' : plusOrMinus(props.value)) +
          ' ' +
          Math.abs(props.value)
        }
      />
      <HSpace />
      <Button
        color="secondary"
        onClick={() => {
          const nextValue = props.value + props.step;
          if (nextValue <= props.max) {
            props.onChange(nextValue);
          }
        }}
        style={
          {
            // marginLeft: '8px',
          }
        }
      >
        <span style={{ userSelect: 'none' }}>+</span>
      </Button>
    </div>
  );
};

export default RangeButtonInput;
