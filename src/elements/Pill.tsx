import React, { PropsWithChildren } from 'react';
import { getColors } from 'style';

interface PillProps extends PropsWithChildren {
  style?: Record<string, string>;
}

const Pill = (props: PillProps) => {
  return (
    <div
      style={{
        padding: '4px 8px',
        display: 'inline-block',
        boxShadow: '0px 0px 4px 0px #000000',
        background: getColors().BACKGROUND,
        color: getColors().PRIMARY_TEXT,
        borderRadius: '16px',
        ...(props.style ?? {}),
      }}
    >
      {props.children}
    </div>
  );
};

export default Pill;
