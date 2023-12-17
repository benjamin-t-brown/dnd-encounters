import { getColors } from 'style';
import styled from 'styled-components';

const CardTitle = styled.div<Object>(() => {
  return {
    textAlign: 'center',
    fontSize: window.innerWidth < 500 ? '1rem' : '2rem',
    color: getColors().TEXT_DEFAULT,
    textTransform: 'uppercase',
    // '-webkit-text-stroke': '1px',
    // '-webkit-text-stroke-color': 'white',
  };
});
export default CardTitle;
