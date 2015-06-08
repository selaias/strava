Strava = {};
// Request Strava credentials for the user
//
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
// completion. Takes one argument, credentialToken on success, or Error on
// error.
Strava.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }
  var config = ServiceConfiguration.configurations.findOne({service: 'strava'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }
  var credentialToken = Random.secret();
  var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
  var display = mobile ? 'touch' : 'popup';
  var scope = "email";
  if (options && options.requestPermissions)
    scope = options.requestPermissions.join(',');
  var loginStyle = OAuth._loginStyle('strava', config, options);
  var loginUrl =
      'https://www.strava.com/oauth/authorize?client_id=' + config.client_id +
      '&redirect_uri=' + OAuth._redirectUri('strava', config) +
      '&approval_prompt=auto' + 
      '&response_type=code' +
      '&state=' + OAuth._stateParam(loginStyle, credentialToken);
  OAuth.launchLogin({
    loginService: "strava",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};