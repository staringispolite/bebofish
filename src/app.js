/*eslint-disable */

// require('../shared/error-reporter');

var App = require('./app.jsx');

document.addEventListener('DOMContentLoaded', function () {
  Bebo.onReady(function () {
    App.init();
  });
});
