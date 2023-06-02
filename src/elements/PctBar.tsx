import React from 'react';
import { getColors } from 'style';

const PctBar = (props: { pct: number; height: string }) => {
  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div
        style={{
          background: 'black',
          height: props.height,
          width: '100%',
        }}
      >
        <div
          style={{
            background: getColors().SUCCESS_BACKGROUND,
            height: props.height,
            width: props.pct * 100 + '%',
          }}
        ></div>
      </div>
    </div>
  );
};

export default PctBar;
