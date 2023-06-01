import React from 'react';
import { getColors } from 'style';

const ImagePortrait = (props: { imgUrl: string }) => {
  return (
    <div
      style={{
        width: '64px',
        height: '64px',
        flexGrow: 0,
        flexShrink: 0,
        backgroundColor: 'black',
        backgroundImage: props.imgUrl ? `url(${props.imgUrl})` : 'unset',
        border: '1px solid ' + getColors().TEXT_DEFAULT,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'local',
        backgroundPosition: 'center',
        backgroundSize: 'auto 100%',
        display: window.innerWidth < 500 ? 'none' : 'block',
      }}
    ></div>
  );
};

export default ImagePortrait;
