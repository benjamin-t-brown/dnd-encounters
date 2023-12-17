import React from 'react';
import Button from './Button';
import { setLSRouteBack } from 'hooks';

const BackButton = () => {
  return (
    <Button
      onClick={() => {
        setLSRouteBack();
      }}
    >
      Back
    </Button>
  );
};

export default BackButton;
