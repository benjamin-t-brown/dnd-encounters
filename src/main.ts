import { getColors } from 'style';
import { createRoot } from 'react-dom/client';
import App from 'App';
import React from 'react';

async function main() {
  console.log('app loaded');

  const div = document.createElement('div');
  div.id = 'app';
  document.body.innerHTML = '';
  document.body.appendChild(div);
  document.body.style.background = getColors().BACKGROUND;

  const root = createRoot(div);
  root.render(React.createElement(App));
}

window.addEventListener('load', () => {
  main();
});
