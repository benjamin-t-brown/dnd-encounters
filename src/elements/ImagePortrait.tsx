import React from 'react';
import { getColors } from 'style';

const ImagePortrait = (props: {
  imgUrl: string;
  hideThreshold: number;
  large?: boolean;
  style?: React.CSSProperties;
}) => {
  let size = '64px';
  if (props.large && window.innerWidth > 600) {
    size = '192px';
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        flexGrow: 0,
        flexShrink: 0,
        backgroundColor: 'black',
        backgroundImage: props.imgUrl ? `url(${props.imgUrl})` : 'unset',
        border: '1px solid ' + getColors().TEXT_DEFAULT,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'local',
        backgroundPosition: 'center',
        backgroundSize: 'auto 100%',
        display: window.innerWidth < props.hideThreshold ? 'none' : 'block',
        ...(props.style ?? {}),
      }}
    ></div>
  );
};

export default ImagePortrait;
