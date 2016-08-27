/*eslint-disable */
'use-strict';

var Analytics = require('./lib/analytics.jsx');
var A = new Analytics();
A.trackRetention();
module.exports = A;
