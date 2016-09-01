/*eslint-disable */

// require('../shared/error-reporter');

var App = require('./app.jsx');

Bebo.onReady(function () {
  Bebo.UI.disableKeyboardDoneStrip();
  App.init();
});

