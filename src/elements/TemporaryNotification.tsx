import React, { useState, useEffect } from 'react';
import { getColors } from 'style';

interface TemporaryNotificationProps {
  message: string;
  variant?: 'neutral' | 'success' | 'error';
  visible?: boolean;
}

export default function TemporaryNotification({
  message,
  variant = 'neutral',
}: TemporaryNotificationProps) {
  // const [visible, setVisible] = useState(true);

  // if (!visible) {
  //   return null;
  // }

  let backgroundColor;
  switch (variant) {
    case 'success':
      backgroundColor = getColors().SUCCESS_BACKGROUND;
      break;
    case 'error':
      backgroundColor = getColors().ERROR_BACKGROUND;
      break;
    default:
      backgroundColor = '#555';
      break;
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: '0',
        top: '0',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 9999,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: '8px',
          margin: '8px',
          marginTop: '60px',
          backgroundColor,
          color: '#fff',
          borderRadius: '4px',
          border: '1px solid white',
        }}
      >
        {message}
      </div>
    </div>
  );
}
