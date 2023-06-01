import { getColors } from 'style';
import styled from 'styled-components';

const FlexWrapCard = styled.div<Object>(() => {
  return {
    border: '1px solid ' + getColors().TEXT_DESCRIPTION,
    borderRadius: '4px',
    margin: '8px',
    cursor: 'pointer',
    overflow: 'hidden',
  };
});

export default FlexWrapCard;
