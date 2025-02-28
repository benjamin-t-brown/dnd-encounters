import React from 'react';
import Button from './Button';
import { useLayer } from 'react-laag';
import { getColors } from 'style';
import { PlacementType } from 'react-laag/dist/PlacementType';

interface DropdownLayerProps extends React.PropsWithChildren {
  style?: React.CSSProperties;
}

const DropdownLayer: any = React.forwardRef<any>(
  (props: DropdownLayerProps, ref) => {
    return (
      <div
        ref={ref}
        style={{
          ...props.style,
          background: getColors().BACKGROUND2,
          border: '1px solid ' + getColors().TEXT_DEFAULT,
          boxShadow: '0px 0px 15px 5px #000000',
          // padding: '16px',
        }}
      >
        {props.children}
      </div>
    );
  }
);

export const DropdownSection = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        margin: '0px 4px',
      }}
    >
      {props.children}
    </div>
  );
};

interface DropdownProps extends React.PropsWithChildren {
  buttonText?: React.ReactNode;
  style?: React.CSSProperties;
  placement?: PlacementType;
}

export const Dropdown = (props: DropdownProps) => {
  const children = props.children;
  const buttonText = props.buttonText;
  const style = props.style ?? {};

  const [optionsOpen, setOptionsOpen] = React.useState(false);
  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen: optionsOpen,
    placement: props.placement ?? 'left-start',
    triggerOffset: 8,
    arrowOffset: 4,
    onOutsideClick: () => setOptionsOpen(false),
  });
  return (
    <>
      <Button
        {...triggerProps}
        color="secondary"
        style={style}
        onClick={() => setOptionsOpen(!optionsOpen)}
      >
        {buttonText ?? <span>≡</span>}
      </Button>
      {optionsOpen &&
        renderLayer(
          <DropdownLayer {...layerProps} arrowProps={arrowProps}>
            {children}
          </DropdownLayer>
        )}
    </>
  );
};
