var os = require('os');

var base = {};

var config =  {
  'bebo-prod': {
    WIDGET_URL: "https://widgets.bebo.com"
  },
  'prod': {
    env: "prod",
    WIDGET_URL: "https://widgets.bebo.com"
  },
  'dev': {
    env: "dev",
    WIDGET_URL: "https://widgets.blab-dev.im"
  }
};
// var environment = process.env.BLAB_ENV || 'local';

var init = function (environment) {
  console.log("ENV", environment);
  for(key in config[environment]){
      base[key] = config[environment][key];
  }

  HOST_TO_REGION = {
    "usw1": "us-west-1",
    "usw2": "us-west-2",
    "use1": "us-east-1"
  };

  var node = os.hostname();
  base['region'] = HOST_TO_REGION[node.split("-")[0]]; 

  base.isProd = function isProd() {
    return base.env === "bebo-prod"
  };
  
  return base;
};

module.exports = init;
