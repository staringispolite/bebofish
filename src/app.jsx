import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/components/main.jsx';


var chat = {
  init: function() {
    ReactDOM.render(<App/>, document.getElementById('app'));
  }
}

module.exports = chat;