import { getColors } from 'style';
import styled from 'styled-components';

const FlexWrapCard = styled.div<Object>(() => {
  return {
    border: '1px solid ' + getColors().TEXT_DESCRIPTION,
    borderRadius: '4px',
    margin: '8px',
    padding: '4px',
    cursor: 'pointer',
    overflow: 'hidden',
    boxShadow: '0px 0px 14px 2px rgba(0,0,0,0.75)',
  };
});

export default FlexWrapCard;
