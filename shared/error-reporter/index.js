/**
 * Created by jonas on 7/30/16.
 */
/*eslint-disable */
'use strict';

var Err = require('./lib/Error.jsx');
var E = new Err();
Bebo.onReady(function() {
  E.initSending();
})
window.ErrorReporter = E;
module.exports = E;