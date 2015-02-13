var Future = Npm.require('fibers/future');
var request = Npm.require('request')


Strava = {};

OAuth.registerService('strava', 2, null, function(query, callback) {

  var accessToken= getTokenResponse(query)
  
  var userData = accessToken.athlete;

  var serviceData = {
    accessToken: accessToken.access_token,
    id: userData.id
  };
  // include fields from strava
  // http://strava.github.io/api/v3/athlete/
  var whitelisted = ['firstname', 'lastname', 'sex', 'profile_medium', 'email', 'country'];

  var fields = _.pick(userData, whitelisted);
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: {profile: {name: userData.firstname, email: userData.email, fullName: userData.firstname + ' ' + userData.lastname, gender: userData.sex, location: userData.country}}
  };
});

var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;


// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {

  var config = ServiceConfiguration.configurations.findOne({service: 'strava'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var request_params = {
    grant_type: "authorization_code",
    code: query.code,
    client_id: config.client_id,
    client_secret: OAuth.openSecret(config.secret),
    redirect_uri: OAuth._redirectUri('strava', config)
  };
  var paramlist = [];
  for (var pk in request_params) {
    paramlist.push(pk + "=" + request_params[pk]);
  };
  var body_string = paramlist.join("&");

  var request_details = {
    method: "POST",
    uri: 'https://www.strava.com/oauth/token',
    body: body_string
  };

    var fut = new Future();
    request(request_details, function(error, response, body) {
       var responseContent;
      try {
        responseContent = JSON.parse(body);
      } catch(e) {
        error = new Meteor.Error(204, 'Response is not a valid JSON string.');
        fut.throw(error);
      } finally {
        fut.return(responseContent);
      }
    });
    var res = fut.wait();
    return res;
};

Strava.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
