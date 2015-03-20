var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatControllers'
]);

phonecatApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/home', {
            templateUrl: 'App/Views/home.html',
            controller: 'HomeCtrl'
        }).
        when('/phones', {
            templateUrl: 'App/Views/phoneList.html',
            controller: 'PhoneListCtrl'
        }).
        when('/phones/:phoneId', {
            templateUrl: 'App/Views/phoneDetail.html',
            controller: 'PhoneDetailCtrl'
        }).
        otherwise({
            redirectTo: '/home'
        });
  }]);