Template.configureLoginServiceDialogForStrava.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});
Template.configureLoginServiceDialogForStrava.fields = function () {
  return [
    {property: 'client_id', label: 'Client ID'},
    {property: 'client_secret', label: 'Client Secret'}
  ];
};