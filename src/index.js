import React from 'react';
import BeboReact from 'bebo-react';
import App from './js/components/main.jsx';
import './index.scss';
import './css/libs/reset.scss';
BeboReact.render(
  <App />,
  document.getElementById('root'),
  {
    disableKeyboardDoneStrip: true,
  }
);
