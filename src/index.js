import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/components/main.jsx';
import './index.scss';
import './css/libs/reset.scss';
// eslint-disable-next-line
Bebo.onReady(() => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
});
