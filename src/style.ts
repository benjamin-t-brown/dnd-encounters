export const colorsDark = {
  PRIMARY: '#A93B3B',
  SECONDARY: '#64468D',
  CANCEL: '#561616',
  BACKGROUND: '#472D3C',
  BACKGROUND2: '#2E3740',
  BACKGROUND3: '#39314B',
  TEXT_DEFAULT: 'white',
  TEXT_DESCRIPTION: '#BBB',
  ERROR_TEXT: '#ff6a6a',
  ERROR_BACKGROUND: '#8f3333',
  SUCCESS_TEXT: '#5eed8a',
  SUCCESS_BACKGROUND: '#005f1b',
  PRIMARY_TEXT: '#8cdaff',
  WARNING_TEXT: '#dd9251',
};

export const getColors = () => {
  return colorsDark;
};

export const MAX_WIDTH = 1400;
export const MEDIA_QUERY_PHONE_WIDTH = `@media (max-width: ${MAX_WIDTH}px)`;
