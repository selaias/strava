Package.describe({
  name: 'selaias:strava',
  version: '0.1.0',
  summary: 'An implementation of the Strava OAuth flow.',
  git: 'https://github.com/selaias/strava.git',
  documentation: 'README.md'
});

Npm.depends({'request': "2.53.0"});

Package.onUse(function(api) {
  
  api.versionsFrom('1.0.3.1');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  
  api.use('service-configuration', ['client', 'server']);
  
  api.addFiles(['strava_configure.html', 'strava_configure.js'], 'client');
  api.addFiles('strava_client.js', 'client');
  api.addFiles('strava_server.js', 'server');
  
  api.export('Strava');
});