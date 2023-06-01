import { colorsDark, getColors } from 'style';
import styled from 'styled-components';

export interface ITabButtonProps {
  active?: boolean;
  flex?: boolean;
  center?: boolean;
  disabled?: boolean;
}
const TabButton = styled.button<ITabButtonProps>(props => {
  const obj = {
    active: getColors().BACKGROUND,
    inactive: getColors().BACKGROUND2,
  };
  const ret: Record<string, string | undefined> = {
    margin: '4px 0px',
    padding: '8px',
    background: obj[props.active ? 'active' : 'inactive'],
    color: colorsDark.TEXT_DEFAULT,
    fontFamily: 'monospace',
    fontSize: '18px',
    cursor: 'pointer',
    border: '1px solid ' + colorsDark.TEXT_DEFAULT,
    borderBottom: props.active ? 'none' : '1px solid black',
    borderRadius: '4px',
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px',
  };
  if (props.flex) {
    ret.display = 'flex';
    ret.alignItems = 'center';
    if (props.center) {
      ret.justifyContent = 'center';
    }
  }
  if (props.disabled) {
    ret.color = colorsDark.TEXT_DESCRIPTION;
    ret.opacity = '0.8';
    ret.filter = 'grayscale(0.5)';
    ret.cursor = 'default';
  }

  return ret;
});

export default TabButton;
