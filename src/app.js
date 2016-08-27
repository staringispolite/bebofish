// require('../shared/error-reporter');

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./app.jsx');

document.addEventListener("DOMContentLoaded", function() {
  Bebo.onReady(function() {
    App.init()
  });
});
