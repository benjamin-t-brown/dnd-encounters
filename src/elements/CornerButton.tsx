import { getColors } from 'style';
import styled from 'styled-components';

const CornerButton = styled.div<Object>(() => {
  return {
    padding: '5px 10px',
    fontSize: '16px',
    color: getColors().ERROR_TEXT,
    cursor: 'pointer',
    borderRadius: '22px',
    background: 'black',
    display: 'inline-block',
    userSelect: 'none',
    borderTopRightRadius: '0px',
    borderTopLeftRadius: '0px',
    borderBottomRightRadius: '0px',
  };
});

export default CornerButton;
