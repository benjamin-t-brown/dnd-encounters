import React from 'react';
import { MAX_WIDTH } from 'style';
import styled from 'styled-components';

const Root = styled.div<Object>(() => {
  return {
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: '100%',
    height: 'calc(100% - 105px)',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'auto',
  };
});

const InnerRoot = styled.div<{ useBoxShadow?: boolean }>(props => {
  return {
    maxWidth: MAX_WIDTH + 'px',
    boxSizing: 'border-box',
    width: window.innerWidth - 50,
    boxShadow: props.useBoxShadow
      ? '0px 0px 16px 0px rgba(0,0,0,0.75)'
      : 'unset',
  };
});

const StandardLayout = (
  props: React.PropsWithChildren & { topBar?: boolean; useBoxShadow?: boolean }
) => {
  return (
    <Root
      id="content-root"
      style={{
        top: props.topBar ? '52px' : '0px',
        marginTop: '52px',
      }}
    >
      <InnerRoot useBoxShadow={props.useBoxShadow}>
        <div
          style={{
            height: '4px',
          }}
        ></div>
        {props.children}
      </InnerRoot>
    </Root>
  );
};

export default StandardLayout;
